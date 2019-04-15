<template>
    <div class="app flex-row align-items-center">
        <div class="container">
            <b-row class="justify-content-center">
                <b-col md="8">
                    <b-card-group>
                        <b-card no-body class="p-4">
                            <b-card-body>
                                <b-form>
                                    <h1>Moyenne.netlify.com <sup>{{ version }}</sup></h1>
                                    <p class="text-muted">Connexion avec vos identifiants EcoleDirecte</p>
                                    <b-alert v-if="errorMessage" show variant="danger" v-html="errorMessage"></b-alert>
                                    <b-input-group class="mb-3">
                                        <b-input-group-prepend>
                                            <b-input-group-text>
                                                <i class="icon-user"></i>
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <b-form-input type="text" class="form-control" placeholder="Nom d'utilisateur" autocomplete="username" v-model="username" />
                                    </b-input-group>
                                    <b-input-group class="mb-4">
                                        <b-input-group-prepend>
                                            <b-input-group-text>
                                                <i class="icon-lock"></i>
                                            </b-input-group-text>
                                        </b-input-group-prepend>
                                        <b-form-input type="password" class="form-control" placeholder="Mot de passe" autocomplete="current-password" v-model="password" />
                                    </b-input-group>
                                    <b-row>
                                        <b-col cols="6">
                                            <b-button variant="primary" class="px-4 ld-ext-right" :class="{ running: $wait.any }" @click="login()">Connexion <div class="ld ld-ring ld-spin"></div></b-button>
                                        </b-col>
                                    </b-row>
                                </b-form>
                            </b-card-body>
                        </b-card>
                    </b-card-group>
                </b-col>
            </b-row>
        </div>

        <b-modal ref="modal" centered busy hide-footer size="sm" title="Qui est-ce ?">
            <b-form-select v-model="selectedAccount" :options="options" class="mt-4 mb-5"/>

            <b-button :disabled="!selectedAccount" variant="primary" @click="setAccount" block>Continuer</b-button>
        </b-modal>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data () {
            return {
                username: null,
                password: null,
                token: null,
                accounts: [],
                selectedAccount: null,
                options: [],
                errorMessage: null
            }
        },
        methods: {
            setAccount: function () {
                let id = this.selectedAccount;

                let account = this.accounts.find(function(account) {
                    return account.id === id;
                });

                localStorage.token = this.token;
                localStorage.user = JSON.stringify(account);
                localStorage.credentials = JSON.stringify({ username: this.username, password: this.password });

                window.bus.$emit('logged-in');

                this.$wait.end();

                this.$router.push('/');
            },
            login: function () {
                this.$wait.start();

                window.axios.post('login.awp', 'data={"identifiant": "'+this.username+'", "motdepasse": "'+this.password+'"}')
                    .then((response) => {
                        if (response.data.code === 200) {
                            this.token = response.data.token;

                            this.options.push({
                                value: null,
                                text: 'Choisissez un utilisateur ...'
                            });

                            let eleves = response.data.data.accounts[0].profile.eleves;

                            eleves.forEach(a => {
                                this.accounts.push(a);

                                this.options.push({
                                    value: a.id,
                                    text: a.prenom+' '+a.nom+' ('+a.classe.libelle+')'
                                });
                            });

                            if (this.accounts.length === 1) {
                                this.selectedAccount = this.accounts[0].id;

                                this.setAccount();
                            } else {
                                this.$refs.modal.show();
                            }
                        } else {
                            this.$wait.end();
                            this.errorMessage = "<strong>Identifiants incorrects</strong>, vérifiez votre nom d'utilisateur et mot de passe."
                        }
                    })
                    .catch(error => {
                        this.$wait.end();
                        this.errorMessage = "<strong>Erreur interne :</strong> "+error+".";
                    });
            }
        },
        mounted() {
            if (this.logged) {
                this.$router.push('/');
            }
        }
    }
</script>

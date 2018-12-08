<template>
    <div class="app flex-row align-items-center">
        <div class="container">
            <b-row class="justify-content-center">
                <b-col md="8">
                    <b-card-group>
                        <b-card no-body class="p-4">
                            <b-card-body>
                                <b-form>
                                    <h1>Moyenne.info</h1>
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
                                            <b-button variant="primary" class="px-4 ld-ext-right" :class="{ running:loading }" @click="login()">Connexion <div class="ld ld-ring ld-spin"></div></b-button>
                                        </b-col>
                                    </b-row>
                                </b-form>
                            </b-card-body>
                        </b-card>
                        <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
                            <b-card-body class="text-center">
                                <div>
                                    <h2>Important :</h2>
                                    <p>Cette application a été développée par un étudiant, pas STATIM SAS (société à l'origine d'EcoleDirecte).</p>
                                    <p>En cas de problème ou pour toute question, merci d'envoyer un email à lucas@decrock.me.</p>
                                </div>
                            </b-card-body>
                        </b-card>
                    </b-card-group>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data () {
            return {
                username: null,
                password: null,
                loading: false,
                accounts: [],
                errorMessage: null
            }
        },
        methods: {
            login: function () {
                this.loading = true;

                window.axios.post('login.awp', 'data={"identifiant": "'+this.username+'", "motdepasse": "'+this.password+'"}')
                    .then((response) => {
                        if (response.data.code === 200) {
                            let accounts = response.data.data.accounts[0].profile.eleves;
                            let eleves = [];

                            accounts.forEach(function (account) {
                                eleves.push({label: account.nom+' '+account.prenom+' ('+account.classe.libelle+')', value: account.id})
                            });

                            if (eleves.length === 1) {
                                localStorage.token = response.data.token;

                                let account = accounts[0];

                                localStorage.user = JSON.stringify(account);
                                localStorage.credentials = JSON.stringify({ username: this.username, password: this.password });

                                window.bus.$emit('logged-in');

                                this.$router.push('/');
                            } else {
                                this.$q.dialog({
                                    title: 'Qui est-ce ?',
                                    message: 'Choisissez un utilisateur pour continuer.',
                                    options: {
                                        type: 'radio',
                                        model: 'accounts',
                                        items: eleves
                                    }
                                }).then((id) => {
                                    localStorage.token = response.data.token;

                                    let account = accounts.find(function(account) {
                                        return account.id === id;
                                    });

                                    localStorage.user = JSON.stringify(account);
                                    localStorage.credentials = JSON.stringify({ username: this.username, password: this.password });

                                    window.bus.$emit('logged-in');

                                    this.$router.push('/');
                                });
                            }
                        } else {
                            this.errorMessage = "<strong>Identifiants incorrects</strong>, vérifiez votre nom d'utilisateur et mot de passe."
                        }
                        this.loading = false;
                    })
                    .catch(error => {
                        this.errorMessage = "<strong>Erreur interne :</strong> "+error+".";
                        this.loading = false
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

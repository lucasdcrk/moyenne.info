<template>
    <q-page padding>
        <div class="row justify-center">
            <sui-segment class="col-sm-10 col-md-6 col-lg-3">
                <div class="q-pa-xl">
                    <h3 class="text-center" is="sui-header">Connexion à EcoleDirecte</h3>

                    <q-alert v-if="errorMessage" class="q-py-sm" type="negative" icon="warning">
                        {{errorMessage}}
                    </q-alert>

                    <sui-form class="q-pt-lg">
                        <sui-form-field>
                            <label>Nom d'utilisateur</label>
                            <input type="text" v-model="username" placeholder="">
                        </sui-form-field>
                        <sui-form-field>
                            <label>Mot de passe</label>
                            <input type="password" v-model="password" placeholder="********">
                        </sui-form-field>

                        <sui-button type="button" :loading="loading" @click="login()" size="large" primary fluid>Connexion</sui-button>
                    </sui-form>
                </div>
            </sui-segment>
        </div>
    </q-page>
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
                        if(response.data.code === 200) {
                            let accounts = response.data.data.accounts[0].profile.eleves;
                            let eleves = [];

                            accounts.forEach(function (account) {
                                eleves.push({label: account.nom+' '+account.prenom+' ('+account.classe.libelle+')', value: account.id})
                            });

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

                                this.$q.notify({
                                    message: 'Connexion réussie, bonjour '+account.prenom+' !',
                                    color: 'primary',
                                    avatar: account.photo
                                });

                                window.bus.$emit('logged-in');

                                this.$router.push('/');
                            });
                        } else {
                            this.$q.notify({
                                message: 'Identifiants incorrects, vérifiez votre saisie.',
                                type: 'negative'
                            })
                        }
                        this.loading = false;
                    })
                    .catch(error => {
                        this.$q.notify('Une erreur s\'est produite : ' + error);
                        this.loading = false;
                    });
            }
        },
        mounted() {
            if(this.logged) {
                this.$q.notify({
                    message: 'Vous êtes déjà connecté, redirection vers l\'accueil',
                    type: 'info'
                });
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>

</style>


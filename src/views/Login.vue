<template>
    <q-page padding>
        <div class="row justify-center">
            <q-card class="col-sm-10 col-md-6 col-lg-4 col-xl-3">
                <div class="q-pa-lg">
                    <q-card-title class="text-center">
                        Connexion à EcoleDirecte
                    </q-card-title>

                    <q-card-main>
                        <q-alert v-if="errorMessage" class="q-py-sm" type="negative" icon="warning">
                            {{errorMessage}}
                        </q-alert>

                        <q-field class="q-py-sm">
                            <q-input float-label="Nom d'utilisateur" v-model="username" type="text"></q-input>
                        </q-field>

                        <q-field class="q-py-sm">
                            <q-input float-label="Mot de passe" v-model="password" type="password"></q-input>
                        </q-field>

                        <q-btn class="full-width q-mt-lg" :loading="loading" @click="login()" size="md" color="primary">Connexion</q-btn>
                    </q-card-main>
                </div>
            </q-card>
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


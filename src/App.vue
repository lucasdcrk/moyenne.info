<template>
    <q-layout view="lHh Lpr lFf">
        <q-layout-header>
            <q-toolbar color="">
                <q-btn v-if="logged" flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu"></q-btn>

                <q-toolbar-title>
                    Moyenne.info <q-chip color="red" dense square v-if="logged && beta">BETA ACCESS</q-chip>
                    <div slot="subtitle">Version {{ version }} par Lucas Decrock</div>
                </q-toolbar-title>

                <div v-if="logged">
                    <q-btn flat @click="logout()">Déconnexion</q-btn>
                </div>
            </q-toolbar>
        </q-layout-header>

        <q-layout-drawer v-if="logged" v-model="leftDrawerOpen" content-class="bg-grey-2">
            <div class="row flex-center bg-white" style="height: 115px">
                <img :src="user.photo" style="width: 75px;">
                <div class="caption q-ml-md">
                    {{ user.prenom+' '+user.nom }}
                    <br>
                    <q-chip color="primary" dense square v-if="logged && beta">{{ user.classe.libelle }}</q-chip>
                </div>
            </div>
            <q-list no-border link inset-delimiter>
                <q-list no-border link inset-delimiter>
                    <q-list-header>Navigation</q-list-header>
                    <q-item to="/" exact>
                        <q-item-side icon="home"/>
                        <q-item-main label="Accueil"/>
                    </q-item>
                    <q-item to="/moyennes" exact>
                        <q-item-side icon="trending_up"/>
                        <q-item-main label="Moyennes"/>
                    </q-item>
                    <q-item to="/notes">
                        <q-item-side icon="list"/>
                        <q-item-main label="Notes"/>
                    </q-item>
                </q-list>
            </q-list>
        </q-layout-drawer>

        <q-page-container>
            <router-view/>
        </q-page-container>
    </q-layout>
</template>

<style>
    .q-toolbar {
        background: #00c6ff;
        background: -webkit-linear-gradient(45deg,  #0072ff, #00c6ff);
        background: linear-gradient(45deg, #0072ff, #00c6ff);
    }
</style>

<script>
    export default {
        data() {
            return {
                leftDrawerOpen: this.$q.platform.is.desktop
            }
        },
        methods: {
            logout() {
                this.$q.dialog({
                    title: 'Déconnexion',
                    message: 'En cliquant sur continuer, nous supprimerons vos données stockées sur ce navigateur.',
                    ok: 'Continuer',
                    cancel: 'Annuler'
                }).then(() => {
                    localStorage.clear();
                    this.$q.notify({
                        message: 'Déconnexion effectuée avec succès.',
                        type: 'info'
                    });
                    window.bus.$emit('logged-out');
                    this.$router.push('/login');
                });
            }
        },
        mounted() {
            this.$q.addressbarColor.set('#0069ff');

            if (this.logged) {
                let user = JSON.parse(localStorage.user);

                window.axios.post('E/' + user.id + '/emploidutemps.awp?verbe=get', 'data={"token": "' + localStorage.token + '"}')
                    .then((response) => {
                        if (response.data.code !== 200) {
                            if (localStorage.credentials && localStorage.user) {
                                let credentials = JSON.parse(localStorage.credentials);

                                this.$q.loading.show({
                                    spinner: 'q-spinner-radio',
                                    message: 'Session expirée, reconnexion en cours ...',
                                    spinnerColor: 'white'
                                });

                                window.axios.post('login.awp', 'data={"identifiant": "'+credentials.username+'", "motdepasse": "'+credentials.password+'"}')
                                    .then((response) => {
                                        if (response.data.code === 200) {
                                            localStorage.token = response.data.token;

                                            let accounts = response.data.data.accounts[0].profile.eleves;

                                            let account = accounts.find(function(account) {
                                                return account.id === user.id;
                                            });

                                            localStorage.user = JSON.stringify(account);

                                            this.$q.loading.hide();
                                            window.bus.$emit('logged-in');

                                            this.$router.push('/');
                                        }
                                    })
                                    .catch(error => {
                                        this.$q.notify('Impossible de rafraichir le token.' + error);
                                        localStorage.clear();
                                        window.bus.$emit('logged-out');
                                        this.$q.loading.hide();
                                        this.$router.push('/login');
                                    });
                            } else {
                                window.bus.$q.notify({
                                    message: 'Session expirée, merci de vous reconnecter.',
                                    type: 'negative'
                                });

                                window.bus.$emit('logged-out');

                                this.$router.push('/login');
                            }
                        }
                    })
                    .catch(error => {
                        window.bus.$q.notify('Une erreur s\'est produite lors de la vérification, merci de recharger la page : ' + error);
                    });
            }

            window.bus.$on('loggout', () => {
                this.logout();
            });
        }
    }
</script>

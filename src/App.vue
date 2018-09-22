<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-btn v-if="logged" flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu"></q-btn>

        <q-toolbar-title>
          Moyenne.info
          <div slot="subtitle">Version {{ version }}</div>
        </q-toolbar-title>

        <div v-if="logged">
          <q-chip :avatar="user.photo" pointing="right" color="blue">
            {{user.prenom+' '+user.nom+' ('+user.classe.libelle+')' }}
          </q-chip>
          <q-btn flat @click="logout()">Déconnexion</q-btn>
        </div>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-if="logged" v-model="leftDrawerOpen" content-class="bg-grey-2">
      <div class="row flex-center bg-white" style="height: 115px">
        <img :src="user.photo" style="height: 75px; width: 75px;">
        <div class="caption q-ml-md">
          {{ user.prenom+' '+user.nom }} ({{ user.classe.code }})
        </div>
      </div>
      <q-list no-border link inset-delimiter>
        <q-list no-border link inset-delimiter>
          <q-list-header>Navigation</q-list-header>
          <q-item to="/" exact>
            <q-item-side icon="home"/>
            <q-item-main label="Accueil"/>
          </q-item>
          <q-item to="/account" exact>
            <q-item-side icon="face"/>
            <q-item-main label="Compte"/>
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
</style>

<script>
  export default {
      data() {
          return {
              leftDrawerOpen: this.$q.platform.is.desktop,
              logged: localStorage.token !== undefined
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
              }).catch(() => {
                  this.$q.notify('Disagreed...')
              });
          }
      },
      mounted() {
          this.$q.addressbarColor.set('#0069ff');

          window.bus.$on('logged-in', () => {
              this.logged = true;
          });

          window.bus.$on('logged-out', () => {
              this.logged = false
          });

          window.bus.$on('loggout', () => {
              this.logout();
          });
      }
  }
</script>

<template>
  <div class="animated fadeIn">
    <div class="text-center">
      <h1 class="display-4">Bonjour, {{user.prenom}} !</h1>
      <h4>Bienvenue sur Moyenne.info</h4>
    </div>
    <b-row class="justify-content-center pt-5">
      <b-col md="4">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Informations
          </div>
          <p class="lead">Bienvenue sur le nouveau moyenne.info !</p><p>N'hésitez pas à envoyer vos suggestions par email à lucas@decrock.me</p>
          <h1 v-if="user.classe.libelle === 'Terminale S2' || user.classe.libelle === 'Terminale S1'">TS2 > TS1 :)</h1>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Utilisateur
          </div>
          <b-row>
            <b-col md="9">
              <h1>{{user.prenom+' '+user.nom}} <small class="text-muted">{{user.classe.libelle}}</small></h1>
            </b-col>
            <b-col md="3">
              <img width="100%" :src="user.photo" alt="">
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Horloge
          </div>
          <div class="text-center">
            <h1 class="display-3">{{now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()}}</h1>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
      data () {
          return {
              now: new Date
          }
      },

      created () {
          setInterval(() => this.now = new Date, 1000)
      }
  }
</script>

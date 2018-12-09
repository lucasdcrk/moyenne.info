<template>
  <div class="animated fadeIn">
    <div class="text-center">
      <h1 class="display-4">Bonjour, {{user.prenom}} !</h1>
      <h4>Bienvenue sur Moyenne.info</h4>
    </div>
    <b-row class="pt-5">
      <b-col md="4">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Informations
          </div>
          <p class="lead">Bienvenue sur le nouveau moyenne.info !</p><p>N'hésitez pas à envoyer vos suggestions par email à lucas@decrock.me</p>
        </b-card>
      </b-col>
      <b-col md="5">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Devoirs
          </div>
          <div class="text-center">
            <h3>Cette fonctionalité n'est pas encore prise en charge.</h3>
          </div>
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

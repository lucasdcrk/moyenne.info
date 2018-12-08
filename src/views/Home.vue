<template>
  <div class="animated fadeIn">
    <div class="text-center">
      <h1 class="display-4">Bonjour, {{user.prenom}} !</h1>
      <h4>Bienvenue sur Moyenne.info</h4>
    </div>
    <b-row class="pt-5">
      <b-col md="9">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Devoirs
          </div>
          <div class="text-center">
            <h1 class="display-2"><i class="icon-close"></i></h1>
          </div>
        </b-card>
      </b-col>
      <b-col md="3">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Horloge
          </div>
          <div class="text-center">
            <h1 class="display-2">{{now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()}}</h1>
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

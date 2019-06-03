<template>
  <div class="animated fadeIn">
    <div class="text-center">
      <h1 class="display-4">Bonjour, {{user.prenom}} !</h1>
      <h4>Bienvenue sur Moyenne.fbi.ovh</h4>
    </div>
    <b-row class="justify-content-center pt-5">
      <b-col md="8">
        <b-alert variant="primary" show>
          <h4 class="alert-heading">Changement d'adresse /!\</h4>
          <p class="lead">Nouvelle adresse du site : <strong>moyenne.fbi.ovh</strong></p>
          <p>
            Ce site n'est plus mis à jour, il est possible qu'il cesse de fonctionner.<br>
            Le code source est en ligne (<a href="https://github.com/lucasdcrk/moyenne.info">lucasdcrk/moyenne.info</a>) si quelqu'un souhaite le reprendre.
          </p>
        </b-alert>
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
    </b-row>
  </div>
</template>

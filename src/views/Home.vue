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
          <p class="lead">Notes de mise à jour (2.2 - 18/03/2019) :</p>
          <ul>
            <li>Fixé : Bug de chargement infini lorsque la session expire</li>
          </ul>
          <p class="lead">Notes de mise à jour (2.1) :</p>
          <ul>
            <li>Ajouté : Alerte fermeture du site</li>
            <li>Fixé : Page de connexion</li>
            <li>Fixé : Les notes non significatives ne sont plus prises en compte dans la moyenne</li>
            <li>Fixé : Bug de chargement infini</li>
            <li>Retiré : Liens inutiles dans la navbar</li>
          </ul>
          <b-alert variant="warning" show>
            <h4 class="alert-heading">Modification</h4>
            <p>
              Update : le site restera en ligne indéfiniment sous une adresse différente mais il ne sera plus mis à jour et risque de cesser de fonctionner.
            </p>
          </b-alert>
          <b-alert variant="danger" show>
            <h4 class="alert-heading">Fermeture du site</h4>
            <p>
              Comme vous le savez sûrement je suis en Terminale et je ne pourrais donc pas m'occuper de ce site durant la prochaine année scolaire. <br>
              De ce fait il fermera définitivement le <strong>1er Juin 2019</strong>. <br>
              Plaignez vous à l'administration si vous n'êtes pas satisfait d'EcoleDirecte ¯\_(ツ)_/¯. <br>
              Le code source est en ligne (<a href="https://github.com/lucasdcrk/moyenne.info">lucasdcrk/moyenne.info</a>) donc toute personne avec des compétences de développement web frontend (Javascript / Typescript + Vue + CSS / SASS) pourra le reprendre.
            </p>
          </b-alert>
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
            <h1 class="display-3">¯\_(ツ)_/¯</h1>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

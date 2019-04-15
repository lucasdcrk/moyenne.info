<template>
  <div class="animated fadeIn">
    <div class="text-center">
      <h1 class="display-4">Bonjour, {{user.prenom}} !</h1>
      <h4>Bienvenue sur Moyenne.netlify.com</h4>
    </div>
    <b-row class="justify-content-center pt-5">
      <b-col md="8">
        <b-alert variant="primary" show>
          <h4 class="alert-heading">Changement d'adresse /!\</h4>
          <p class="lead">Nouvelle adresse du site : <strong>moyenne.netlify.com</strong> (ajoutez la à vos favoris).<br>A partir du <strong>1er Juin 2019</strong> ne sera plus accessible depuis l'ancienne adresse (moyenne.info).</p>
          <p>
            Ce site n'est plus mis à jour, il est possible qu'il cesse de fonctionner.<br>
            Le code source est en ligne (<a href="https://github.com/lucasdcrk/moyenne.info">lucasdcrk/moyenne.info</a>) si quelqu'un souhaite le reprendre.
          </p>
        </b-alert>
      </b-col>
      <b-col md="5">
        <b-card header-tag="header" footer-tag="footer">
          <div slot="header">
            Informations
          </div>
          <p class="lead">Notes de mise à jour (2.3 - 15/04/2019) :</p>
          <ul>
            <li>Changement d'hébergeur</li>
            <li>Nouvelle adresse moyenne.netlify.com</li>
            <li>Ceci est la dernière mise à jour du site.</li>
          </ul>
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
    </b-row>
  </div>
</template>

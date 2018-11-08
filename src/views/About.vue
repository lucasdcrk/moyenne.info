<template>
    <q-page padding>
        <div class="row gutter-md justify-center">
            <div class="col-xs-12 col-md-6 col-lg-4">
                <q-card>
                    <q-card-media>
                        <img src="../assets/logo-full.png">
                    </q-card-media>
                    <q-card-main class="q-pa-lg">
                        <div class="q-title q-mb-sm">A propos du site :</div>

                        <ul>
                            <li>Développé avec VueJS</li>
                            <li>Mode beta : {{ beta ? 'Activé' : 'Non' }}</li>
                            <li>Version du site : <em><strong>v{{ version }}</strong> (PRODUCTION BUILD)</em></li>
                            <li>Hébergeur : <em>Firebase, une filiale de <strong>Google LLC</strong>.</em></li>
                        </ul>

                        <q-card-separator/>

                        <div class="q-mt-md">
                            <div class="q-title">Informations personelles récoltées :</div>
                            <ul>
                                <li>Nom</li>
                                <li>Prénom</li>
                                <li>Classe</li>
                            </ul>
                            <p>Ces informations sont récoltées afin d'établir des statistiques.</p>
                        </div>
                    </q-card-main>
                </q-card>
            </div>

            <div class="col-xs-12 col-md-6 col-lg-3">
                <q-card>
                    <q-item>
                        <q-item-side avatar="https://i.imgur.com/sMhwRbf.png"/>
                        <q-item-main>
                            <q-item-tile label>Lucas Decrock</q-item-tile>
                            <q-item-tile sublabel>A propos du créateur</q-item-tile>
                        </q-item-main>
                    </q-item>
                    <q-card-main>
                        <p>Plus d'info sur <a href="https://lucas.decrock.me">lucas.decrock.me</a></p>

                        <div class="text-center">
                            <div class="q-headline q-ma-sm">Contact</div>
                            <img src="../assets/snapcode.png" alt="">
                            <p>lucas.dcrk</p>
                        </div>
                    </q-card-main>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<style scoped>
    .showcase-top {
        margin-top: 30px;
    }

    .showcase-top img {
        margin-bottom: 15px;
    }

    img {
        height: 150px;
        margin-bottom: 15px;
    }

    .showcase-top {
        margin-top: 50px;
        margin-bottom: 35px;
    }
</style>



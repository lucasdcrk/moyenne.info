<template>
    <div class="window-height row justify-center items-center">
        <div class="text-center">
            <p>
                <img src="../assets/sad.svg" style="width:30vw;max-width:150px;">
            </p>
            <p class="text-faded">
                Page non trouvée
                <strong>(Erreur 404)</strong>
            </p>
            <q-btn color="primary" style="width:200px;" @click="$router.push('/')">Retour à l'accueil</q-btn>
        </div>
    </div>
</template>

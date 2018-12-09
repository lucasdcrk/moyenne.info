<template>
    <div class="animated fadeIn">
        <b-tabs>
            <b-tab title="Avertissement" active>
                <b-alert variant="danger" show>
                    <h4 class="alert-heading">Attention !</h4>
                    <p class="lead">
                        <strong>Des données sensibles (mots de passes et autres) sont affichées sur cette page.</strong><br>
                        Ne communiquez ces informations que si elles sont demandées par le créateur du site
                    </p>
                    <hr>
                    <p class="mb-0">
                        Vous pouvez vérifier si la personne avec qui vous communiquez est bien le créateur du site en lui demandant votre UserId.<br>
                        Si la personne vous répond autre chose que <strong>UID-{{user.id}}</strong>, il sagit d'un fake.
                    </p>
                </b-alert>
            </b-tab>
            <b-tab v-for="i in data" :title="i.label" :key="i">
                <p class="lead">{{i.description}}</p>
                <small style="word-wrap: break-word">{{i.data}}</small>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data: [
                    { label: 'localStorage.user', description: 'Données utilisateurs stockées localement', data: localStorage.user },
                    { label: 'localStorage.token', description: 'Token donnant un accès temporaire (~30m) à votre compte', data: localStorage.token },
                    { label: 'localStorage.credentials', description: 'Vos identifiants EcoleDirecte', data: localStorage.credentials }
                ]
            }
        }
    }
</script>

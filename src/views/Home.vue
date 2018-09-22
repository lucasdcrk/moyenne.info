<template>
    <div class="showcase-top text-center">
        <img src="../assets/logo.png">

        <p class="caption">
            Bienvenue sur Moyenne.info, utilisez les boutons ci-dessous pour accèder à la section désirée.
            <br>
            <em>Rapport de bug : lucas@decrock.me</em>
        </p>

        <div class="row justify-center">
            <div style="width: 850px; max-width: 90vw;" class="row">
                <div v-for="section in sections" :key="section.link" class="col-xs-6 col-sm-4 col-lg-3">
                    <div class="card text-center category-link text-primary" @click="show(section.link)">
                        <q-icon :name="section.icon"/>
                        <p class="caption">{{ section.title }}</p>
                    </div>
                </div>
                <div class="col-xs-6 col-sm-4 col-lg-3">
                    <div class="card text-center category-link text-grey" @click="logout()">
                        <q-icon name="exit_to_app"/>
                        <p class="caption">Déconnexion</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        data() {
            return {
                sections: [
                    { title: 'Compte', icon: 'face', link: 'account' },
                    { title: 'Notes', icon: 'list', link: 'notes' }
                ]
            }
        },
        methods: {
            show (link) {
                this.$router.push('/'+link)
            },
            logout() {
                window.bus.$emit('loggout');
            }
        }
    }
</script>

<style scoped>
    .showcase-top {
        margin-top: 30px;
    }

    .showcase-top img {
        margin-bottom: 15px;
    }

    img {
        width: 100px;
        height: 100px;
        margin-bottom: 15px;
    }

    .showcase-top {
        margin-bottom: 35px;
    }

    .showcase-top .q-alert {
        max-width: 500px;
    }

    .card {
        cursor: pointer;
        position: relative;
        padding: 16px;
    }

    .card .q-icon {
        font-size: 56px;
    }

    .card p {
        color: rgba(0,0,0,0.87);
        margin: 15px 0 0 0 !important;
    }

    .card:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: 2px;
        opacity: 0;
        transition: opacity 0.2s;
        background: currentColor;
    }

    .card:hover:before {
        opacity: 0.4;
    }
</style>

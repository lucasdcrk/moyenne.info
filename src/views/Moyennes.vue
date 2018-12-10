<template>
    <div class="container animated fadeIn" v-if="periodes.length > 0">
        <div class="text-center">
            <h1 class="display-4">Moyennes</h1>
        </div>
        <b-row class="pt-5">
            <b-col v-for="periode in periodes" :key="periode.id">
                <b-card header-tag="header" footer-tag="footer">
                    <div slot="header">
                        Trimestre {{periode.periode.charAt(0)}}
                        <span class="float-right">Trimestre {{!periode.cloture && periode.moyenne ? 'en cours' : periode.cloture ? 'cloturé' : 'à venir'}}</span>
                    </div>
                    <div class="text-center">
                        <h1 class="display-3">{{periode.moyenne ? periode.moyenne+'/20' : '--'}}</h1>
                        Moyenne Générale
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import GetPeriodes from '../mixins/GetPeriodes'

    export default {
        mixins: [GetPeriodes],
        data() {
            return {
                periodes: []
            }
        },
        mounted() {
            this.$wait.start();

            this.getPeriodes()
                .then(data => {
                    this.periodes = data;
                    this.$wait.end();
                });
        }
    }
</script>

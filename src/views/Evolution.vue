<template>
    <div class="animated fadeIn" v-if="periodes.length > 0">
        <div class="container">
            <b-card header="Evolution de votre moyenne sur l'année">
                <div class="chart-wrapper">
                    <bar-chart :labels="trimestres" :datasets="moyennes" style="max-height: 30vh;"/>
                </div>
            </b-card>
        </div>
    </div>
</template>

<script>
    import getPeriodes from '../mixins/GetPeriodes'
    import BarChart from '../components/charts/Bar'

    export default {
        name: 'Graphs',
        mixins: [getPeriodes],
        components: { 'bar-chart': BarChart },
        data() {
            return {
                periodes: [],
                trimestres: [],
                moyennes: []
            }
        },
        mounted() {
            this.$wait.start();

            this.getPeriodes()
                .then(data => {
                    this.periodes = data;

                    this.periodes.forEach(p => {
                        this.trimestres.push('Trimestre '+p.periode.charAt(0));
                    });

                    let moyennesGenerales = [];
                    let moyennesGeneralesClasse = [];

                    this.periodes.forEach(p => {
                        moyennesGenerales.push(p.moyenne);
                        moyennesGeneralesClasse.push(p.moyenneClasse);
                    });

                    this.moyennes.push({
                        label: 'Votre moyenne',
                        backgroundColor: '#3e95cd',
                        data: moyennesGenerales
                    }, {
                        label: 'Moyenne de la classe',
                        backgroundColor: '#3cba9f',
                        data: moyennesGeneralesClasse
                    });

                    this.$wait.end();
                });
        }
    }
</script>

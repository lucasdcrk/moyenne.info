<template>
    <div class="animated fadeIn">
        <div class="container">
            <b-card header="Evolution de votre moyenne sur l'année">
                <div class="chart-wrapper">
                    <bar-chart v-if="periodes" :labels="trimestres" :datasets="moyennes" style="max-height: 30vh;"/>
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
                periodes: null
            }
        },
        mounted() {
            this.periodes = this.getPeriodes();
        },
        computed: {
            trimestres: function () {
                let trimestres = [];

                if (this.periodes) {
                    this.periodes.forEach(p => {
                        trimestres.push('Trimestre '+p.periode.charAt(0));
                    });
                }

                return trimestres
            },
            moyennes: function () {
                let moyennes = [];

                if (this.periodes) {
                    let moyennesGenerales = [];
                    let moyennesGeneralesClasse = [];

                    this.periodes.forEach(p => {
                        moyennesGenerales.push(p.moyenne);
                        moyennesGeneralesClasse.push(p.moyenneClasse);
                    });

                    moyennes.push({
                        label: 'Votre moyenne',
                        backgroundColor: '#3e95cd',
                        data: moyennesGenerales
                    }, {
                        label: 'Moyenne de la classe',
                        backgroundColor: '#3cba9f',
                        data: moyennesGeneralesClasse
                    });
                }

                return moyennes
            }
        }
    }
</script>

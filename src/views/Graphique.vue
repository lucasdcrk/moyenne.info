<template>
    <div class="animated fadeIn" v-if="periodes.length > 0">
        <div class="container">
            <b-row class="justify-content-center">
                <b-col md="12" xl="7">
                    <b-tabs>
                        <b-tab v-for="periode in periodes" :title="'Trimestre '+periode.periode.charAt(0)" :active="!periode.cloture && periode.moyenne > 0" :key="periode.id">
                            <div v-if="periode.moyenne">
                                <div class="chart-wrapper">
                                    <radar-chart v-if="periode" :labels="periode.chart_matieres" :datasets="periode.chart_moyennes"/>
                                </div>
                            </div>
                            <div v-else>
                                <div class="py-5 text-center">
                                    <h1>
                                        <i class="icon-close" style="font-size: 5rem;"></i>
                                        <br>
                                        Aucune donnée pour ce trimestre
                                    </h1>
                                </div>
                            </div>
                        </b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
    import getPeriodes from '../mixins/GetPeriodes'
    import RadarChart from '../components/charts/Radar'

    export default {
        name: 'Graphs',
        mixins: [getPeriodes],
        components: { 'radar-chart': RadarChart },
        data() {
            return {
                periodes: [],
            }
        },
        mounted() {
            this.$wait.start();

            this.getPeriodes().then(data => {
                this.periodes = data;

                this.periodes.forEach(p => {
                    p.chart_matieres = [];
                    p.moyennes = [];
                    p.moyennesClasse = [];

                    p.ensembleMatieres.disciplines.forEach(m => {
                        if (m.moyenne) {
                            if (p.chart_matieres.indexOf(m.discipline) === -1) {
                                p.chart_matieres.push(m.discipline);
                            }

                            p.moyennes.push(m.moyenne);
                            p.moyennesClasse.push(m.moyenneClasse);
                        }
                    });

                    p.chart_moyennes = [];

                    p.chart_moyennes.push({
                        label: 'Moyenne élève',
                        backgroundColor: 'rgb(255, 99, 132, 0.2)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: p.moyennes
                    }, {
                        label: 'Moyenne classe',
                        backgroundColor: 'rgb(255, 159, 64, 0.2)',
                        borderColor: 'rgb(255, 159, 64)',
                        data: p.moyennesClasse
                    });
                });

                this.$wait.end();
            }, () => {
                console.log('Erreur lors de la récupération des moyennes.');
            })

        }
    }
</script>

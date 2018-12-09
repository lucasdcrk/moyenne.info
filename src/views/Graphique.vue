<template>
    <div class="animated fadeIn">
        <div class="container">
            <b-row class="justify-content-center">
                <b-col xl="7">
                    <b-card header="Graphique de vos moyennes annuelles">
                        <div class="chart-wrapper">
                            <radar-chart v-if="periodes" :labels="matieres" :datasets="trimestres"/>
                        </div>
                    </b-card>
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
                periodes: null
            }
        },
        mounted() {
            this.periodes = this.getPeriodes();
        },
        computed: {
            matieres: function () {
                let matieres = [];

                if (this.periodes) {
                    this.periodes.forEach(p => {
                        p.ensembleMatieres.disciplines.forEach(m => {
                            if (matieres.indexOf(m.discipline) === -1 && m.moyenne) {
                                matieres.push(m.discipline);
                            }
                        });
                    });
                }

                return matieres
            },
            trimestres: function () {
                let trimestres = [];

                if (this.periodes) {
                    this.periodes.forEach(p => {
                        p.moyennes = [];
                        p.ensembleMatieres.disciplines.forEach(m => {
                            if (m.moyenne) {
                                p.moyennes.push(m.moyenne);
                            }
                        });

                        let tid = parseInt(p.periode.charAt(0));
                        let color = null;

                        switch (tid) {
                            case 1:
                                color = 'rgb(255, 99, 132';
                                break;
                            case 2:
                                color = 'rgb(255, 159, 64';
                                break;
                            case 3:
                                color = 'rgb(54, 162, 235';
                                break;
                        }

                        trimestres.push({
                            label: 'Trimestre '+tid,
                            backgroundColor: color+', 0.2)',
                            borderColor: color+')',
                            data: p.moyennes
                        });
                    });
                }

                return trimestres
            }
        }
    }
</script>

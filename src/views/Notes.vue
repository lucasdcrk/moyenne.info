<template>
    <q-page padding>
        <div class="text-center q-pb-lg">
            <h1 is="sui-header" style="font-size: 4em">Notes</h1>
        </div>

        <div class="row justify-center">
            <div class="col-md-8">
                <div v-if="periodes.length === 0">
                    <sui-tab>
                        <sui-tab-pane v-for="n in 3" :key="n" :title="'Trimestre '+n " loading/>
                    </sui-tab>
                </div>

                <sui-tab v-else>
                    <sui-tab-pane v-for="periode in periodes" :key="periode.idPeriode" :title="'Trimestre '+periode.periode.charAt(0)+' - '+periode.moyenne+'/20'">
                        <sui-accordion exclusive fluid styled>
                            <div v-if="periode.moyenne">
                                <div v-for="matiere in periode.ensembleMatieres.disciplines" :key="matiere.id">
                                    <div v-if="matiere.moyenne">
                                        <sui-accordion-title>
                                            <sui-icon name="dropdown"/>
                                            {{matiere.discipline}} <span class="float-right">{{matiere.moyenne}}/20</span>
                                        </sui-accordion-title>

                                        <sui-accordion-content>
                                            <sui-table celled>
                                                <sui-table-header>
                                                    <sui-table-row>
                                                        <sui-table-header-cell>Libellé</sui-table-header-cell>
                                                        <sui-table-header-cell>Coefficient</sui-table-header-cell>
                                                        <sui-table-header-cell>Note</sui-table-header-cell>
                                                    </sui-table-row>
                                                </sui-table-header>

                                                <sui-table-body>
                                                    <sui-table-row :state="matiere.moyenne ? '' : 'disabled'" v-for="note in matiere.notes" :key="note.id">
                                                        <sui-table-cell>{{note.devoir}}</sui-table-cell>
                                                        <sui-table-cell>{{note.coef}}</sui-table-cell>
                                                        <sui-table-cell><h3 is="sui-header" text-align="center">{{note.valeur+'/'+note.noteSur}}</h3></sui-table-cell>
                                                    </sui-table-row>
                                                </sui-table-body>
                                            </sui-table>
                                        </sui-accordion-content>
                                    </div>
                                </div>
                            </div>

                            <div class="ui placeholder segment" v-else>
                                <div class="ui icon header">
                                    <i class="exclamation triangle icon"></i>
                                    Pas de données pour cette période.
                                </div>
                            </div>
                        </sui-accordion>
                    </sui-tab-pane>
                </sui-tab>
            </div>
        </div>
    </q-page>
</template>

<script>
    export default {
        name: 'Notes',
        data() {
            return {
                loading: false,
                periodes: []
            }
        },
        mounted() {
            this.getNotes();
        },
        methods: {
            getNotes() {
                window.axios.post('eleves/'+this.user.id+'/notes.awp?verbe=get&', 'data={"token": "'+this.token+'"}')
                    .then((response) => {
                        if (response.data.code === 200) {
                            let periodes = response.data.data.periodes.filter(function (periode) {
                                return periode.idPeriode === 'A001' || periode.idPeriode === 'A002' || periode.idPeriode === 'A003'
                            });

                            let notes = response.data.data.notes;

                            periodes.forEach(function (periode) {
                                periode.matieres = [];
                                periode.totalMoyennes = 0;
                                periode.totalCoefs = 0;

                                periode.ensembleMatieres.disciplines.forEach(function (matiere) {
                                    matiere.notes = [];
                                    matiere.totalNotes = 0;
                                    matiere.totalCoefs = 0;

                                    notes.forEach(function (note) {
                                        if (matiere.codeMatiere === note.codeMatiere && periode.idPeriode === note.codePeriode) {
                                            if (!note.enLettre) {
                                                let valeur = parseFloat(note.valeur.replace(/,/, '.'));
                                                let noteSur = parseFloat(note.noteSur.replace(/,/, '.'));
                                                let coef = parseFloat(note.coef.replace(/,/, '.'));

                                                note.valeur = (20 / noteSur) * valeur;
                                                note.noteSur = (20 / noteSur) * noteSur;

                                                matiere.notes.push(note);
                                                matiere.totalNotes = matiere.totalNotes + note.valeur * coef;
                                                matiere.totalCoefs = matiere.totalCoefs + coef;
                                            }
                                        }
                                    });

                                    if (matiere.notes.length > 0) {
                                        matiere.moyenne = Math.round((matiere.totalNotes / matiere.totalCoefs) * 100) / 100;
                                        periode.matieres.push(matiere);
                                        periode.totalMoyennes = periode.totalMoyennes + matiere.moyenne * parseFloat(matiere.coef);
                                        periode.totalCoefs = periode.totalCoefs + parseFloat(matiere.coef);
                                        console.log(periode);
                                    }
                                });

                                periode.moyenne = Math.round((periode.totalMoyennes / periode.totalCoefs) * 100) / 100;
                            });

                            this.periodes = periodes;
                        }
                    })
                    .catch(error => {
                        this.$q.notify('Une erreur s\'est produite : ' + error);
                    });
            }
        }
    }
</script>

<style scoped>

</style>

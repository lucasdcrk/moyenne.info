<template>
    <q-page v-if="periodes.length > 0" padding>
        <div class="row justify-center">
            <div class="col-md-8">
                <q-tabs color="primary" underline-color="warning" align="justify">
                    <!-- Tabs - notice slot="title" -->
                    <q-tab :default="periode === periodes[0]" slot="title" v-for="periode in periodes" :key="periode.idPeriode" :name="periode.idPeriode">{{ periode.periode }}</q-tab>

                    <q-card square color="grey-3" text-color="black">
                        <q-card-main>
                            <!-- Targets -->
                            <q-tab-pane v-for="periode in periodes" :key="periode.idPeriode" :name="periode.idPeriode">
                                <div v-if="periode.moyenne">
                                    <div class="q-ma-md">
                                        <div class="q-headline">Information trimestre :</div>
                                        <ul>
                                            <li>Moyenne générale : <strong>{{ periode.moyenne }}/20</strong></li>
                                            <li>Etat du trimestre : <strong>{{ periode.cloture ? 'Cloturé' : 'Ouvert' }}</strong></li>
                                            <li>Date conseil de classe : <strong>{{ periode.dateConseil }}</strong></li>
                                            <li>Prof. Principal : <strong>{{ periode.ensembleMatieres.nomPP.replace('¤', ' & ') }}</strong></li>
                                        </ul>
                                    </div>

                                    <div class="q-ma-md q-mt-xl">
                                        <div class="q-headline">Détail des matières :</div>
                                    </div>

                                    <q-table :data="periode.ensembleMatieres.disciplines" :columns="columns" row-key="name" rows-per-page="0" :pagination.sync="pagination" :rows-per-page-options="[]" grid/>
                                </div>

                                <div v-else class="row justify-center q-my-xl">
                                    <div class="col-md-5 q-my-xl">
                                        <q-alert type="warning">
                                            Aucune donnée à afficher pour cette période, réessayez plus tard.
                                        </q-alert>
                                    </div>
                                </div>
                            </q-tab-pane>
                        </q-card-main>
                    </q-card>
                </q-tabs>
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
                trimestres: [1, 2, 3],
                periodes: [],
                columns: [
                    {
                        name: 'matiere',
                        required: true,
                        label: 'Matière',
                        align: 'left',
                        field: 'discipline',
                        sortable: true
                    },
                    {
                        name: 'prof',
                        required: true,
                        label: 'Professeur(s)',
                        align: 'left',
                        field: row => row.professeurs.length > 1 ? row.professeurs[0].nom +' & '+ row.professeurs[1].nom : row.professeurs[0].nom,
                        sortable: true
                    },
                    {
                        name: 'coef',
                        required: true,
                        label: 'Coefficient matière',
                        align: 'center',
                        field: 'coef',
                        sortable: true
                    },
                    {
                        name: 'moyenne',
                        required: true,
                        label: 'Moyenne trimestrielle',
                        align: 'center',
                        field: 'moyenne',
                        format: val => (val !== undefined) ? `${val}/20` : '',
                        sortable: true
                    }
                ],
                pagination: {
                    sortBy: 'coef', // String, column "name" property value
                    descending: true,
                    page: 1,
                    rowsPerPage: 0
                }
            }
        },
        mounted() {
            this.getNotes();
        },
        methods: {
            getNotes() {
                this.$q.loading.show();

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
                                                note.valeur = (20 / parseFloat(note.noteSur)) * parseFloat(note.valeur);
                                                matiere.notes.push(note);
                                                matiere.totalNotes = matiere.totalNotes + parseFloat(note.valeur) * parseFloat(note.coef);
                                                matiere.totalCoefs = matiere.totalCoefs + parseFloat(note.coef);
                                            }
                                        }
                                    });

                                    if (matiere.notes.length > 0) {
                                        matiere.moyenne = Math.round((matiere.totalNotes / matiere.totalCoefs) * 100) / 100;
                                        periode.matieres.push(matiere);
                                        periode.totalMoyennes = periode.totalMoyennes + matiere.moyenne * parseFloat(matiere.coef);
                                        periode.totalCoefs = periode.totalCoefs + parseFloat(matiere.coef);
                                    }
                                });

                                periode.moyenne = Math.round((periode.totalMoyennes / periode.totalCoefs) * 100) / 100;
                                console.log(periode)
                            });

                            this.periodes = periodes;
                        } else {
                            this.$q.notify({
                                message: 'Impossible de récupérer les notes pour le moment',
                                type: 'negative'
                            })
                        }

                        this.$q.loading.hide();
                    })
                    .catch(error => {
                        this.$q.notify('Une erreur s\'est produite : ' + error);
                        this.$q.loading.hide();
                    });
            }
        }
    }
</script>

<style scoped>

</style>

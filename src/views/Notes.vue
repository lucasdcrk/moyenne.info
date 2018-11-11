<template>
    <q-page padding>
        <div class="text-center q-pb-lg">
            <div class="q-display-3">Notes</div>
        </div>

        <div class="row gutter-md justify-center">
            <div class="col-md-10">

                <div class="q-table-container q-ma-lg" v-for="periode in periodes" :key="periode.idPeriode" v-if="periode.moyenne">
                    <div class="q-table-top relative-position row items-center">
                        <div class="q-table-control">
                            <div class="q-table-title">
                                Notes Trimestre {{periode.periode.charAt(0)}}
                            </div>
                        </div>
                    </div>
                    <div class="q-table-middle scroll">
                        <table class="q-table q-table-horizontal-separator">
                            <thead>
                            <tr>
                                <th class="text-left">
                                    Matière
                                </th>
                                <th class="text-left">
                                    Moyenne
                                </th>
                                <th class="text-right">
                                    Notes
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="matiere in periode.ensembleMatieres.disciplines" :key="matiere.id" v-if="matiere.moyenne">
                                <td class="text-left">
                                    {{matiere.discipline}} (Coef {{matiere.coef}})
                                </td>
                                <td class="text-left">
                                    {{matiere.moyenne+'/20'}}
                                </td>
                                <td class="text-right">
                                    <q-chip class="chip q-mx-sm" square v-for="note in matiere.notes" :key="note.id">
                                        {{note.valeur+'/'+note.noteSur}}<sup>({{note.coef}})</sup>
                                        <q-tooltip :offset="[0, 15]">
                                            {{note.devoir}} ({{note.date}}, coef {{note.coef}})
                                        </q-tooltip>
                                    </q-chip>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<style>
    .chip {
        cursor: pointer;
    }
</style>

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
                                                let valeur = parseFloat(String(note.valeur).replace(/,/, '.'));
                                                let noteSur = parseFloat(String(note.noteSur).replace(/,/, '.'));
                                                let coef = parseFloat(String(note.coef).replace(/,/, '.'));

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

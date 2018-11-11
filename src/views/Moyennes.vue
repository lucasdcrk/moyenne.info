<template>
    <q-page padding>
        <div class="text-center q-pb-lg">
            <div class="q-display-3">Moyennes</div>
        </div>

        <div class="row gutter-md justify-center">
            <div class="col-xs-12 col-md-6 col-lg-3" v-for="periode in periodes" :key="periode.id">
                <q-card>
                    <q-card-title>
                        Trimestre {{ periode.periode.charAt(0) }}
                        <span slot="subtitle">Trimestre {{!periode.cloture && periode.moyenne ? 'en cours' : periode.cloture ? 'cloturé' : 'à venir'}}</span>
                    </q-card-title>
                    <q-card-main>
                        <div class="text-center q-ma-lg">
                            <div class="q-display-1">{{ periode.moyenne ? periode.moyenne+'/20' : '--' }}</div>
                            <div class="q-subheading text-grey">Moyenne Générale</div>
                        </div>

                        <q-card-separator/>

                        <blockquote class="q-mt-md">
                            Conseil : {{ periode.dateConseil }}<br>
                            PP : {{ periode.ensembleMatieres.nomPP.replace('¤', ' & ') }}<br>
                        </blockquote>
                    </q-card-main>
                </q-card>
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
                                periode.modalOpen = false;
                                periode.matieres = [];
                                periode.totalMoyennes = 0;
                                periode.totalCoefs = 0;

                                periode.ensembleMatieres.disciplines.forEach(function (matiere) {
                                    matiere.notes = [];
                                    matiere.totalNotes = 0;
                                    matiere.totalCoefs = 0;

                                    notes.forEach(function (note) {
                                        if (matiere.codeMatiere === note.codeMatiere && periode.idPeriode === note.codePeriode) {
                                            if (!note.enLettre && !note.nonSignificatif) {
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

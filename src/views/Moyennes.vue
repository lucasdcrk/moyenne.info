<template>
    <div class="container animated fadeIn">
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
    export default {
        data() {
            return {
                periodes: []
            }
        },
        mounted() {
            this.getNotes();
        },
        methods: {
            getNotes() {
                this.$wait.start();

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

                        this.$wait.end();
                    })
                    .catch(error => {
                        console.log('Une erreur s\'est produite : ' + error);
                    });
            }
        }
    }
</script>

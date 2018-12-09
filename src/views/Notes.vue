<template>
    <div class="animated fadeIn">
        <b-tabs>
            <b-tab v-for="periode in periodes" :title="'Trimestre '+periode.periode.charAt(0)" :active="!periode.cloture && periode.moyenne" :key="periode.id">
                <b-tabs card pills vertical nav-wrapper-class="w-40">
                    <b-tab v-for="matiere in periode.matieres" :key="matiere.id">
                        <template slot="title">
                            {{matiere.discipline}}
                        </template>
                        <b-row class="justify-content-between">
                            <b-col md="3">
                                <h3>Infos matière</h3>
                                <b-list-group>
                                    <b-list-group-item>Votre moyenne : <strong class="float-right">{{matiere.moyenne ? matiere.moyenne+'/20' : ''}}</strong></b-list-group-item>
                                    <b-list-group-item>Moyenne de classe : <strong class="float-right">{{matiere.moyenneClasse ? matiere.moyenneClasse+'/20' : ''}}</strong></b-list-group-item>
                                    <b-list-group-item>Rang : <strong class="float-right">{{matiere.rang}}e de la classe</strong></b-list-group-item>
                                    <b-list-group-item>Libellé : <span class="float-right">{{matiere.discipline}}</span></b-list-group-item>
                                    <b-list-group-item>Coeficient : <span class="float-right">{{matiere.coef}}</span></b-list-group-item>
                                    <b-list-group-item>Enseignement optionel ? <span class="float-right">{{matiere.option ? 'Oui' : 'Non'}}</span></b-list-group-item>
                                </b-list-group>
                                <hr>
                                <h4>Professeur(s)</h4>
                                <b-list-group>
                                    <b-list-group-item v-for="professeur in matiere.professeurs" :key="professeur">
                                        {{professeur.nom}}
                                    </b-list-group-item>
                                </b-list-group>
                            </b-col>
                            <b-col md="9">
                                <h3>Notes</h3>
                                <b-table hover striped responsive="sm" :items="matiere.notes" :fields="['devoir', 'coef', 'valeur', 'moyenneClasse', 'date']"/>
                            </b-col>
                        </b-row>
                    </b-tab>
                </b-tabs>
            </b-tab>
        </b-tabs>
    </div>
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
                                periode.totalMoyennesClasse = 0;
                                periode.totalCoefs = 0;

                                periode.ensembleMatieres.disciplines.forEach(function (matiere) {
                                    matiere.notes = [];
                                    matiere.totalNotes = 0;
                                    matiere.totalNotesClasse = 0;
                                    matiere.totalCoefs = 0;

                                    notes.forEach(function (note) {
                                        if (matiere.codeMatiere === note.codeMatiere && periode.idPeriode === note.codePeriode) {
                                            if (!note.enLettre) {
                                                let valeur = parseFloat(String(note.valeur).replace(/,/, '.'));
                                                let valeurClasse = parseFloat(String(note.moyenneClasse).replace(/,/, '.'));
                                                let noteSur = parseFloat(String(note.noteSur).replace(/,/, '.'));
                                                let coef = parseFloat(String(note.coef).replace(/,/, '.'));

                                                note.valeur = (20 / noteSur) * valeur;
                                                note.valeurClasse = (20 / noteSur) * valeurClasse;
                                                note.noteSur = (20 / noteSur) * noteSur;

                                                matiere.notes.push(note);
                                                matiere.totalNotes = matiere.totalNotes + note.valeur * coef;
                                                matiere.totalNotesClasse = matiere.totalNotesClasse + note.valeurClasse * coef;
                                                matiere.totalCoefs = matiere.totalCoefs + coef;
                                            }
                                        }
                                    });

                                    if (matiere.notes.length > 0) {
                                        matiere.moyenne = Math.round((matiere.totalNotes / matiere.totalCoefs) * 100) / 100;
                                        matiere.moyenneClasse = Math.round((matiere.totalNotesClasse / matiere.totalCoefs) * 100) / 100;
                                        periode.matieres.push(matiere);
                                        periode.totalMoyennes = periode.totalMoyennes + matiere.moyenne * parseFloat(matiere.coef);
                                        periode.totalMoyennesClasse = periode.totalMoyennesClasse + matiere.moyenneClasse * parseFloat(matiere.coef);
                                        periode.totalCoefs = periode.totalCoefs + parseFloat(matiere.coef);
                                    }
                                });

                                periode.moyenne = Math.round((periode.totalMoyennes / periode.totalCoefs) * 100) / 100;
                                periode.moyenneClasse = Math.round((periode.totalMoyennesClasse / periode.totalCoefs) * 100) / 100;
                            });

                            this.periodes = periodes;
                        }

                        this.$wait.end();
                    })
                    .catch(error => {
                    });
            }
        }
    }
</script>

<style scoped>

</style>

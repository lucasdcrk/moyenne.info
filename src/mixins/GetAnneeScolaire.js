export default {
    data() {
        return {
            annee: null
        }
    },
    methods: {
        getAnneeScolaire() {
            this.$wait.start();

            window.axios.post('eleves/' + this.user.id + '/notes.awp?verbe=get&', 'data={"token": "' + this.token + '"}')
                .then((response) => {
                    let annee = response.data.data.periodes.find(function (periode) {
                        return periode.idPeriode === 'A999Z'
                    });

                    let notes = response.data.data.notes;

                    annee.matieres = [];
                    annee.totalMoyennes = 0;
                    annee.totalMoyennesClasse = 0;
                    annee.totalCoefs = 0;

                    annee.ensembleMatieres.disciplines.forEach(function (matiere) {
                        matiere.notes = [];
                        matiere.totalNotes = 0;
                        matiere.totalNotesClasse = 0;
                        matiere.totalCoefs = 0;

                        notes.forEach(function (note) {
                            if (matiere.codeMatiere === note.codeMatiere && annee.idannee === note.codeannee) {
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
                            annee.matieres.push(matiere);
                            annee.totalMoyennes = annee.totalMoyennes + matiere.moyenne * parseFloat(matiere.coef);
                            annee.totalMoyennesClasse = annee.totalMoyennesClasse + matiere.moyenneClasse * parseFloat(matiere.coef);
                            annee.totalCoefs = annee.totalCoefs + parseFloat(matiere.coef);
                        }
                    });

                    annee.moyenne = Math.round((annee.totalMoyennes / annee.totalCoefs) * 100) / 100;
                    annee.moyenneClasse = Math.round((annee.totalMoyennesClasse / annee.totalCoefs) * 100) / 100;

                    this.$wait.end();
                    this.annee = annee;
                    return annee;
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
};

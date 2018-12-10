export default {
    data() {
        return {
            periodes: [],
            error: null
        }
    },
    methods: {
        getPeriodes() {
            return new Promise((resolve, reject) => {
                window.axios.post('eleves/' + this.user.id + '/notes.awp?verbe=get&', 'data={"token": "' + this.token + '"}')
                    .then((response) => {
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

                        resolve(periodes);

                        return periodes;
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        }
    }
};

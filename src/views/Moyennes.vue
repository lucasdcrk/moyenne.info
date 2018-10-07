<template>
    <q-page padding>
        <div class="text-center q-pb-lg">
            <h1 is="sui-header" style="font-size: 4em">Moyennes</h1>
        </div>

        <div class="row justify-center">
            <div class="col-md-8">
                <div class="ui horizontal segments" v-if="periodes.length === 0">
                    <div class="ui raised segment" v-for="n in 3" :key="n">
                        <div class="ui placeholder">
                            <div class="header">
                                <div class="short line"></div>
                                <div class="line"></div>
                            </div>

                            <div class="image" style="max-width: 20%"></div>

                            <div class="paragraph">
                                <div class="short line"></div>
                                <div class="very long line"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ui segments" v-else>
                    <div class="ui horizontal segments">
                        <div class="ui raised segment" v-for="periode in periodes" :key="periode.id">
                            <h3 is="sui-header">
                                <sui-button floated="right" size="mini" @click="periode.modalOpen = true">Détails</sui-button>
                                Trimestre {{ periode.periode.charAt(0) }}
                                <sui-header-subheader>Trimestre {{!periode.cloture && periode.moyenne ? 'en cours' : periode.cloture ? 'cloturé' : 'à venir'}}</sui-header-subheader>
                            </h3>

                            <div class="text-center q-py-lg">
                                <h2 is="sui-header">
                                    {{ periode.moyenne ? periode.moyenne+'/20' : '--' }}
                                    <sui-header-subheader>Moyenne Générale</sui-header-subheader>
                                </h2>
                            </div>

                            Conseil : {{ periode.dateConseil }}<br>
                            PP : {{ periode.ensembleMatieres.nomPP.replace('¤', ' & ') }}<br>


                            <sui-modal v-model="periode.modalOpen">
                                <sui-modal-header>Moyennes matières {{ periode.periode }}</sui-modal-header>
                                <sui-modal-content>
                                    <sui-modal-description>
                                        <sui-table celled>
                                            <sui-table-header>
                                                <sui-table-row>
                                                    <sui-table-header-cell>Matière</sui-table-header-cell>
                                                    <sui-table-header-cell>Professeur(s)</sui-table-header-cell>
                                                    <sui-table-header-cell>Coefficient</sui-table-header-cell>
                                                    <sui-table-header-cell>Moyenne</sui-table-header-cell>
                                                </sui-table-row>
                                            </sui-table-header>

                                            <sui-table-body>
                                                <sui-table-row :state="matiere.moyenne ? '' : 'disabled'" v-for="matiere in periode.ensembleMatieres.disciplines" :key="matiere.id">
                                                    <sui-table-cell>{{matiere.discipline}}</sui-table-cell>
                                                    <sui-table-cell>{{matiere.professeurs.length > 1 ? matiere.professeurs[0].nom +' & '+ matiere.professeurs[1].nom : matiere.professeurs[0].nom}}</sui-table-cell>
                                                    <sui-table-cell>{{matiere.coef}}</sui-table-cell>
                                                    <sui-table-cell><h2 is="sui-header" text-align="center">{{matiere.moyenne ? matiere.moyenne+'/20' : '--'}}</h2></sui-table-cell>
                                                </sui-table-row>
                                            </sui-table-body>
                                        </sui-table>
                                    </sui-modal-description>
                                </sui-modal-content>
                                <sui-modal-actions>
                                    <sui-button type="button" @click.native="periode.modalOpen = false">
                                        Fermer
                                    </sui-button>
                                </sui-modal-actions>
                            </sui-modal>
                        </div>
                    </div>
                </div>
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

<template>
    <div class="animated fadeIn" v-if="periodes.length > 0">
        <b-tabs>
            <b-tab v-for="periode in periodes" :title="'Trimestre '+periode.periode.charAt(0)" :active="!periode.cloture && periode.moyenne > 0" :key="periode.id">
                <div v-if="periode.moyenne">
                    <b-tabs card pills vertical nav-wrapper-class="w-40">
                        <b-tab v-for="matiere in periode.matieres" :key="matiere.id" :active="periode.matieres[0].id === matiere.id">
                            <template slot="title">
                                {{matiere.discipline}}
                            </template>
                            <b-row class="justify-content-between">
                                <b-col md="3">
                                    <h3>Infos matière</h3>
                                    <b-list-group>
                                        <b-list-group-item>Votre moyenne : <strong class="float-right">{{matiere.moyenne ? matiere.moyenne+'/20' : ''}}</strong></b-list-group-item>
                                        <b-list-group-item>Moyenne de classe : <strong class="float-right">{{matiere.moyenneClasse ? matiere.moyenneClasse+'/20' : ''}}</strong></b-list-group-item>
                                        <b-list-group-item>
                                            Rang :
                                            <strong class="float-right" v-if="matiere.rang !== 0">{{matiere.rang}}e de la classe</strong>
                                            <strong class="float-right" v-else>Inconnu</strong>
                                        </b-list-group-item>
                                        <b-list-group-item>Libellé : <span class="float-right">{{matiere.discipline}}</span></b-list-group-item>
                                        <b-list-group-item>Coeficient : <span class="float-right">{{matiere.coef}}</span></b-list-group-item>
                                        <b-list-group-item>Enseignement optionel ? <span class="float-right">{{matiere.option ? 'Oui' : 'Non'}}</span></b-list-group-item>
                                    </b-list-group>
                                    <hr>
                                    <h4>Professeur(s)</h4>
                                    <b-list-group>
                                        <b-list-group-item v-for="professeur in matiere.professeurs" :key="professeur.id">
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
                </div>
                <div v-else>
                    <div class="py-5 text-center">
                        <h1>
                            <i class="icon-close" style="font-size: 5rem;"></i>
                            <br>
                            Aucune note dans ce trimestre
                            <br>
                            <img class="mt-5" src="https://i.imgur.com/mxr8Wzq.png" alt="">
                        </h1>
                    </div>
                </div>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    import getPeriodes from '../mixins/GetPeriodes'

    export default {
        name: 'Notes',
        mixins: [getPeriodes],
        data() {
            return {
                periodes: []
            }
        },
        mounted() {
            this.$wait.start();

            this.getPeriodes()
                .then(data => {
                    this.periodes = data;
                    this.$wait.end();
                });
        }
    }
</script>

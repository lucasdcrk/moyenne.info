<script>
    import { Bar } from 'vue-chartjs'
    import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'

    export default {
        name: 'BarChart',
        extends: Bar,
        props: {
            labels: {
                type: Array,
                default: null
            },
            datasets: {
                type: Array,
                default: null
            }
        },
        mounted () {
            this.renderChart({
                labels: this.labels,
                datasets: this.datasets
            }, {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: false,
                    custom: CustomTooltips,
                    intersect: true,
                    mode: 'index',
                    position: 'nearest',
                    callbacks: {
                        labelColor: function (tooltipItem, chart) {
                            return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 20,
                            stepSize: 2
                        }
                    }]
                }
            })
        }
    }
</script>

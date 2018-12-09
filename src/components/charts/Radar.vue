<script>
    import { Radar } from 'vue-chartjs'
    import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips'

    export default {
        name: 'RadarChart',
        extends: Radar,
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
                maintainAspectRatio: true,
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
                scale: {
                    ticks: {
                        min: 0,
                        max: 20
                    }
                }
            })
        }
    }
</script>

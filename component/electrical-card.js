//電力
var template = /*html*/ `
<div 
    id="electrical-card"
    class="card"
>
    <div class="title-text">今日累積用電</div>
    <div class="show-power">
        <div class="power">
            {{electric}} kWh
        </div>
        <div class="triangle"></div>
        <div class="ep-percent">{{percent}}%</div>
    </div>

    <div class="pass-power">昨日同期累積：{{passPower}} kWh</div>
    <!-- line chart canvas element -->
    <canvas width="300" height="240" ref="buyers"></canvas>
</div>
`
export default {
    name: 'electrical-card',
    template,
    data() {
        return {
            electric: 345,
            passPower: 320,
            percent: 2,
        }
    },
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            new Chart(this.$refs.buyers, {
                type: "line",
                data: {
                    labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
                    datasets: [{
                        label: "My First Dataset",
                        data : [203,156,170,251,287,247,277],
                        fill: false,
                        pointColor : "#fff",
                        pointStrokeColor : "#9DB86D",
                        defaultFontColor : '#f7f33a',
                        borderColor: "rgb(75, 192, 192)",
                        lineTension: 0.1
                    }]
                },
            });
        }
    },
}

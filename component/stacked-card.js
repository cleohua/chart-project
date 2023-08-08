//估驗計價
var template = /*html*/ `
<div class="row-dashboard-item-area">
    <div 
        class="dashboard-item-area stacked-area" 
        id="stacked-area"
    >
        <div class="dashboard-item">
            <div class="dashboard-title-area">
                <span class="title">估驗計價</span>
            </div>
            <div class="dashboard-content">
                <div class="estimate-item totla-estimate">
                    <span class="estimate-title">總預算：{{totalMoney}}</span>
                    <span class="estimate-content"></span>
                </div>
                <div class="estimate-item pre-estimate">
                    <span class="estimate-title">本月請款：{{thisMonthReimburse}}</span>
                    <span class="estimate-content"></span>
                </div>
                <div class="estimate-item be-estimate">
                    <span class="estimate-title">已請款：{{totalReimburse}}({{percent}}%)</span>
                </div>
                <div class="estimate-bar-chart">
                    <canvas ref="stacked" height="50"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>
`
import * as callapi from "../callAPI.js";
export default {
    name: 'stacked-area',
    template,
    props: {
        project: {
            type: String
        },
        projectid: {
            type: String
        }
    },
    data() {
        return {
            totalMoney: 0, //總預算
            totalMoneyForCahrt: 0, //表格用總預算
            totalReimburse: 0, //已請款
            totalReimburseForCahrt: 0, //表格用已請款
            thisMonthReimburse: 0, //本月請款
            totalNoReimburse: 0, //未請款
            moneyData: null,
            percent: 0,
            projectUid: !this.project ? this.projectid : this.project,
        }
    },
    methods: {
        async renderChart() {
            const moneyData = await callapi.getMoneyData(this.projectUid);
            let totalMoney = 0;
            if (moneyData) {
                totalMoney = parseInt(moneyData.work_val);
            }
            this.totalMoneyForCahrt = totalMoney;
            this.totalMoney = totalMoney.toLocaleString('en-US');
            
            const milestoneData = await callapi.getMilestoneData("", this.projectUid);
            let totalReimburse = 0; //已請款
            let thisMonthReimburse = 0; //本月請款
            let now = new Date();
            let y = now.getFullYear(),
            m = now.getMonth() + 1
            let thisMonth = y + "-" + m;
            
            $.each(milestoneData, function (i, v) {
                let monthReimburse = 0; //月請款 
                $.each(v, function (i2, v2) {
                    monthReimburse += parseInt(v2.name);
                    totalReimburse += parseInt(v2.name);
                    
                    //本月請款
                    if (thisMonth == i) {
                        thisMonthReimburse += parseInt(v2.name);
                    }
                })
            });
            this.totalReimburseForCahrt = totalReimburse;
            this.totalReimburse = totalReimburse.toLocaleString('en-US');
            this.thisMonthReimburse = thisMonthReimburse.toLocaleString('en-US');
            
            let percentNum = 0
            this.totalReimburseForCahrt > 0 ? percentNum = (this.totalReimburseForCahrt / this.totalMoneyForCahrt) * 100 : percentNum = 0 ;
            this.percent = percentNum.toFixed(2);
            if (this.totalMoney > this.totalReimburse) {
                this.totalNoReimburse = this.totalMoney - this.totalReimburse;
            }
            
            let color = {
                red:"rgba(157, 140, 206, 0.3)",
                blue:"rgb(166, 210, 255, 0.3)",
                borderBlue:"rgb(166, 210, 255, 0.5)",
                borderRed:"rgba(157, 140, 206, 0.5)",
                fillBlue:"rgb(166, 210, 255, 0.3)",
                fillRed:"rgba(157, 140, 206, 0.3)",
            }
            new Chart(this.$refs.stacked, {
                type: "bar",
                data: {
                    labels: ["已請款","未請款"],
                    datasets: [{
                        axis: 'y',
                        backgroundColor: [color.blue, color.red],
                        borderColor: [color.borderBlue, color.borderRed],
                        fill:[color.fillBlue, color.fillRed],
                        borderWidth: 2,
                        data: [this.totalReimburseForCahrt, this.totalNoReimburse],
                        barThickness: 35 
                    },
                ]}, 
                options: { 
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                color: 'white',
                            },
                        },
                    }, 
                    scales: {
                        x: {
                            ticks: {
                                beginAtZero: true,
                                fontColor: '#e2e2e2',
                                color: 'white',
                            },
                            grid: {
                                color: 'grey'
                            }
                        },
                        y: {
                            ticks: {
                                beginAtZero: true,
                                fontColor: '#e2e2e2', 
                                color: 'white',
                            },
                            grid: {
                                color: 'grey' 
                            }
                        },
                    },
                },
            });
        },
    },
    mounted() {
        this.renderChart();
    },
}
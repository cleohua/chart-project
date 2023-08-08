//查核督導
var template = /*html*/ `
<div 
    class="dashboard-item-area supervision-area" 
    id="supervision-area" 
>
    <div class="dashboard-item">
        <div class="dashboard-title-area">
            <span class="title">查核督導</span>
        </div>
        <div class="dashboard-content">
            <div id="supervision-piechart">
                <div class="total-count">
                    總筆數： {{totalCount}} 筆
                </div>
                <canvas ref="barForSupervision" width="180" height="130"></canvas>
            </div>
        </div>
    </div>
</div>
`
import * as callapi from "../callAPI.js";
export default {
    name: 'supervision-area',
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
            totalCount: 0, //總筆數
            totalNoOverdue: 0, //未逾期總筆數
            totalOverdue: 0, //已逾期總筆數
            projectUid: !this.project ? this.projectid : this.project,
        }
    },
    methods: {
        async renderChart() {
            const rsData = await callapi.getSupervisionData(this.projectUid);
            let countDo = 0; //未改善
            let countCheck = 0; //待審核
            let countPass = 0; //已通過
            let countDoOverdue = 0; //未改善(逾期)
            let countCheckOverdue = 0; //待審核(逾期)
            let countPassOverdue = 0; //已通過(逾期)
            let totalCountDo = 0;
            let totalCountCheck = 0;
            let totalCountPass = 0;
            if (rsData.length > 0) {
                $.each(rsData[0].sysData, function (i, v) {
                    let pendingDate;
                    if (!v.pending_date) {
                        pendingDate = new Date(new Date().toLocaleDateString().substring(0, 10) + " 0:0:0");
                    } else {
                        pendingDate = new Date(v.pending_date.replace(/-/g, '/') + " 0:0:0");
                    }
                    const isOverdue = (pendingDate - new Date(v.limitDate)) > 0;
                    
                    if (v.status == "0" && !isOverdue) {
                        countDo += 1;
                    } else if (v.status == "1" && !isOverdue) {
                        countCheck += 1;
                    } else if (v.status == "2" && !isOverdue) {
                        countPass += 1;
                    } else if (v.status == "0" && isOverdue) {
                        countDoOverdue += 1;
                    } else if (v.status == "1" && isOverdue) {
                        countCheckOverdue += 1;
                    } else if (v.status == "2" && isOverdue) {
                        countPassOverdue += 1;
                    }
                });
            }
        
            this.totalCount = countDo + countCheck + countPass + countDoOverdue + countCheckOverdue + countPassOverdue;
            totalCountDo = countDo + countDoOverdue;
            totalCountCheck = countCheck + countCheckOverdue;
            totalCountPass = countPass + countPassOverdue;
            this.totalNoOverdue = countDo + countCheck + countPass;
            this.totalOverdue = countDoOverdue + countCheckOverdue + countPassOverdue;
            new Chart(this.$refs.barForSupervision, {
                type: "bar",
                data: {
                    labels:["未改善(" + totalCountDo + ")", "待審核(" + totalCountCheck + ")", "已通過(" + totalCountPass + ")"],
                    datasets: [{
                        label: "已逾期(" + this.totalOverdue + ")",
                        backgroundColor: "rgba(255, 99, 71, 0.3)",
                        borderColor: "rgba(255, 99, 71, 0.5)",
                        fill:"rgba(255, 99, 71, 0.3)",
                        borderWidth: 2,
                        data: [countDoOverdue,countCheckOverdue,countPassOverdue]
                    }, {
                        label: "未逾期(" + this.totalNoOverdue + ")",
                        backgroundColor: "rgba(118, 163, 158, 0.3)",
                        borderColor: "rgba(118, 163, 158, 0.5)",
                        fill:"rgba(118, 163, 158, 0.3)",
                        borderWidth: 2,
                        data: [countDo,countCheck,countPass]
                    } 
                ]}, 
                options: { 
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white',
                            },
                            
                        },
                    },
                    scales: {
                        y: {
                            ticks: {
                                beginAtZero: true,
                                stepSize: 50,
                                color: 'white', 
                                callback: function(value, index, values) {
                                    return value; 
                                }     
                            },
                            grid: {
                                color: 'grey' 
                            }
                        },
                        x: {
                            ticks: { 
                                color: 'white', 
                                beginAtZero: true 
                            },
                            grid: {
                                color: 'grey' 
                            }
                        }
                    },
                },
            });
        }
    },
    mounted() {
        this.renderChart();
    },
}
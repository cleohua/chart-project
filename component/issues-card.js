//工作議題
var template = /*html*/ `
<div 
    class="dashboard-item-area issues-area" 
    id="issues-area" 
    ref="issues"
>
    <div class="dashboard-item">
        <div class="dashboard-title-area">
            <span class="title">工作議題</span>
            <!-- <div class="title-action-area mouse-pointer">
                <div class="full-screen-btn action-btn">
                    <i class="fa fa-expand" aria-hidden="true"></i>
                    <span>全螢幕</span>
                </div>
            </div> -->
        </div>
        <div class="dashboard-content">
            <div id="issues-piechart">
                <div 
                    class="total-count"
                >
                    總筆數： {{totalCount}} 筆
                </div>
                <canvas ref="work" width="200" height="150"></canvas>
            </div>
        </div>
    </div>
</div>
`

import * as callapi from "../callAPI.js";
export default {
    name: 'issues-area',
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
            const rsData = await callapi.getIssuesData(this.projectUid);
            //wait: 0, act: 1, back: 2, pass: 3
            let count = [0, 0, 0, 0];
            let countOverDue = [0, 0, 0, 0];
            if(rsData.length > 0) {
                const { sysData } = rsData[0];
                sysData.forEach(v => {
                    if (v.end_date == null) {
                        return;
                    }
                    let now = new Date(new Date().toLocaleDateString().substring(0, 10) + " 0:0:0");
                    let end = new Date(v.end_date.replace(/-/g, '/') + " 0:0:0");
                    let isOverdue = (now - end) > 0;
                    if (v.status == '1') {
                        isOverdue ? countOverDue[0]++ : count[0]++;
                    } else if (v.status == '2') {
                        isOverdue ? countOverDue[1]++ : count[1]++;
                    } else if (v.status == '3') {
                        isOverdue ? countOverDue[2]++ : count[2]++;
                    } else if (v.status == '4') {
                        isOverdue ? countOverDue[3]++ : count[3]++;
                    }
        
                });
            }

            const sumArr = (arr) => arr.reduce((sum, num) => sum + num);
            const add = (inedex) => count[inedex] + countOverDue[inedex];
            const totalCountwait = add(0);
            const totalCountAct = add(1);
            const totalCountBack = add(2);
            const totalCountPass = add(3);
            this.totalOverdue = sumArr(countOverDue);
            this.totalNoOverdue = sumArr(count);
            this.totalCount = this.totalNoOverdue + this.totalOverdue;
            
            new Chart(this.$refs.work, {
                type: "bar",
                data: {
                    labels:["尚未開始(" + totalCountwait + ")", "進行中(" + totalCountAct + ")", "退件(" + totalCountBack + ")", "完成(" + totalCountPass + ")"],
                    datasets: [{
                        label: "已逾期(" + this.totalOverdue + ")",
                        backgroundColor: "rgba(255, 99, 71, 0.3)",
                        borderColor: "rgba(255, 99, 71, 0.5)",
                        fill:"rgba(255, 99, 71, 0.3)",
                        borderWidth: 2,
                        data: countOverDue
                    }, {
                        label: "未逾期(" + this.totalNoOverdue + ")",
                        backgroundColor: "rgba(118, 163, 158, 0.3)",
                        borderColor: "rgba(118, 163, 158, 0.5)",
                        fill:"rgba(118, 163, 158, 0.3)",
                        borderWidth: 2,
                        data: count
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
                            borderColor: 'white',
                            stepSize: 50,
                            color: '#e2e2e2', //更改y軸文字顏色
                            callback: function(value, index, values) {
                                // 動態設置 y 軸刻度標籤
                                return value; 
                            }        
                          },
                          grid: {
                            color: 'grey' //更改線格顏色
                          }
                        },
                        x: {
                          ticks: {
                            color: '#e2e2e2',
                            borderColor: 'grey',
                            fontSize: 14  //更改x軸文字顏色
                          },
                          grid: {
                            color: 'grey' //更改線格顏色
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
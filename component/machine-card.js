//機具
var template = /*html*/ `
<div class="dashboard-item-area machine-area" id="machine-area">
    <div class="dashboard-item">
        <div class="dashboard-title-area">
            <span class="title">機具</span>
        </div>
        <div class="machine-main">
            <div
                class="select-day"
            >
                <div class="datepicker-for-day">
                    <i
                        class="fa fa-calendar" 
                    ></i>
                    <date-range-picker
                        v-model="datepickerRange"
                        :min="progressInfoList.start_date"
                        :max="today"
                        @input="searchDay"
                    />
                </div>
            </div>
            <div 
                class="dashboard-content-machine"
            >
                <div class="machine-chart" ref="machineArea">
                    <canvas ref="machineChart" width="170" height="100" v-show="machineList.length != 1"></canvas>
                    <span v-show="machineList.length <= 1">此日期暫無相關資料</span>
                </div>
            </div>
        </div>
    </div>
</div>
`
import * as callapi from "../callAPI.js";
export default {
    name: 'machine-area',
    template,
    props: {
        project: {
            type: String
        },
        projectid: {
            type: String
        }
    },
    components: { 'datepicker': VueDatepicker.Datepicker, 'date-range-picker': VueDatepicker.DateRangePicker },
    data() {
        return {
            machineList: [],
            datepickerRange: [],
            progressInfoList: [],
            today: '',
            projectUid: !this.project ? this.projectid : this.project,
            machineChartInstance: null,
        }
    },
    methods: {
        searchDay() {
            this.refresh();
        },
        async createChart() {
            let start = this.datepickerRange[0];
            let end = this.datepickerRange[1];
            let sendData = {
                start_date: start,
                end_date: end
            }
            const rsData = await callapi.getMachineChartData(sendData, this.projectUid);
            this.machineList = rsData[0];
            const listArr = this.machineList.slice(1);
            const dateArr = rsData.map(subArr => subArr[0]).slice(1);
            const dataListForMashine = rsData.map(subArray => subArray.slice(1));

            let color = ['rgb(39, 201, 187, 0.6)', 'rgb(255, 145, 156, 0.6)', 'rgb(112, 208, 233, 0.6)', 'rgb(227, 71, 25, 0.6)', 'rgb(161, 206, 239, 0.6)', 'rgb(161, 156, 255, 0.6)', '#rgb(161, 156, 178, 0.6)','rgb(161, 41, 54, 0.6)','rgb(200, 201, 54, 0.6)','rgb(255, 165, 77, 0.6)'];
            const newData = dataListForMashine.reduce((acc, cur) => {
                for (let i = 0; i < cur.length; i++) {
                    if (!acc[i]) {
                        acc[i] = [];
                    }
                    acc[i].push(cur[i]);
                }
                return acc;
            }, []);

            const machineData = newData.map(subArray => subArray.slice(1));
            let chartData = {
                labels: dateArr,
                datasets: listArr.map((label, index) => ({
                    label: label,
                    borderColor: color[index],
                    fill: false,
                    lineTension: 0, // 曲線的彎度，設 0 表示直線
                    borderWidth: 2,
                    data: machineData[index],
                }))
            };

            let chartOption = { 
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
                        color: 'white',
                        callback: function(value, index, values) {
                            // 動態設置 y 軸刻度標籤
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
                      },
                      grid: {
                        color: 'grey' 
                      }
                    }
                },
            };

            this.machineChartInstance = new Chart(this.$refs.machineChart , {
                type: "line",
                data: chartData, 
                options: chartOption
            });
        },
        async refresh() {
            let start = this.datepickerRange[0];
            let end = this.datepickerRange[1];
            let sendData = {
                start_date: start,
                end_date: end
            }
            const rsData = await callapi.getMachineChartData(sendData, this.projectUid);
            this.machineList = rsData[0];
            const listArr = this.machineList.slice(1);
            const dateArr = rsData.map(subArr => subArr[0]).slice(1);
            const dataListForMashine = rsData.map(subArray => subArray.slice(1));

            let color = ['rgb(39, 201, 187, 0.6)', 'rgb(255, 145, 156, 0.6)', 'rgb(112, 208, 233, 0.6)', 'rgb(227, 71, 25, 0.6)', 'rgb(161, 206, 239, 0.6)', 'rgb(161, 156, 255, 0.6)', '#rgb(161, 156, 178, 0.6)','rgb(161, 41, 54, 0.6)','rgb(200, 201, 54, 0.6)','rgb(255, 165, 77, 0.6)'];
            const newData = dataListForMashine.reduce((acc, cur) => {
                for (let i = 0; i < cur.length; i++) {
                    if (!acc[i]) {
                        acc[i] = [];
                    }
                    acc[i].push(cur[i]);
                }
                return acc;
            }, []);

            const machineData = newData.map(subArray => subArray.slice(1));
            let chartData = {
                labels: dateArr,
                datasets: listArr.map((label, index) => ({
                    label: label,
                    borderColor: color[index],
                    fill: false,
                    lineTension: 0, // 曲線的彎度，設 0 表示直線
                    borderWidth: 2,
                    data: machineData[index],
                }))
            };

            let chartOption = { 
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
                        color: 'white',
                        callback: function(value, index, values) {
                            // 動態設置 y 軸刻度標籤
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
                      },
                      grid: {
                        color: 'grey' 
                      }
                    }
                },
            };

            if(this.machineChartInstance != undefined) 
                this.machineChartInstance.destroy();
            
            this.machineChartInstance =  new Chart(this.$refs.machineChart , {
                type: "line",
                data: chartData, 
                options: chartOption
            });
        }
    },
    async created() {
        this.progressInfoList = await callapi.getProgressInfoData(this.projectUid);
        const today = new Date();
        let year = today.getFullYear(); 
        let month = today.getMonth() + 1; 
        let day = today.getDate();
        let dayMonth = month - 1 ;
        month < 10 ? month = "0" + month : month;
        day < 10 ?  day = "0" + day : day;
        dayMonth < 10 ? dayMonth = "0" + dayMonth : dayMonth;
        
        this.today = year + '-' + month + '-' + day;
        this.datepickerRange = [year + "-" + dayMonth + "-" + day, year + "-" + month + "-" + day];
        this.createChart();
    } 
}
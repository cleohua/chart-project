//材料
var template = /*html*/ `
<div class="dashboard-item-area material-area" id="material-area" ref="materialArea">
    <div class="dashboard-item">
        <div class="dashboard-title-area">
            <span class="title">材料</span>
            <div class="title-action-area mouse-pointer">
            </div>
        </div>
        <div class="dashboard-content-material">
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
                class="dashboard-content-material"
            >
                <div id="material-detail" >
                    <div
                        class="expect-title"
                        v-show="barChart == false"
                    >
                        <div class="title-no">項次</div>
                        <div class="title-name">名稱(單位)</div>
                        <div class="title-count">設計數量</div>
                        <div class="title-use-count">累積數量</div>
                        <div class="title-time-use">期間累積</div>
                    </div>
                    <div 
                        class="material-area-scroll" 
                        :style="spanStyle"
                    >
                        <div 
                            class="material-main"
                            v-show="materialList.length !== 0 && barChart == false"
                            v-for="(item, index) in materialList"
                            @click="showChart(item)"
                        >
                            <div class="material-index">{{index + 1}}</div>
                            <div class="material-title">{{item.name}}({{item.unit}})</div>
                            <div class="material-count">
                                <div class="material-total-count">{{item.total_sum}}</div>
                                <div class="material-use-count">{{item.all_use_sum}}</div>
                                <div class="material-time-use">{{item.total_use_sum}}</div>
                            </div>
                        </div>
                        <span v-show="materialList.length == 0">此日期暫無相關資料</span>
                        <div
                            class="bar-chart"
                            v-show="barChart == true" 
                        >
                            <span @click="barChart = false">返回上頁</span>
                            <canvas ref="material" width="120" height="80"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
import * as callapi from "../callAPI.js";
export default {
    name: 'material-area',
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
            materialList: [],
            barChart: false,
            datepickerRange: [],
            progressInfoList: [],
            today: '',
            projectUid: !this.project ? this.projectid : this.project,
        }
    },
    computed: {
        spanStyle() {
            if(this.materialList.length == 0) {
                return `display: flex; align-items: center; justify-content: center;`
            }
        }
    },
    methods: {
        searchDay() {
            this.refresh();
        },
        showChart(item) {
            this.barChart = true;
            const date = item.list.map(i => i.date);
            const totalSum = item.list.map(i => i.total_sum);
            const useSum = item.list.map(i => i.use_sum);
            console.log(this.$refs.materialArea.bar);

            if(this.$refs.materialArea.bar != undefined) 
            this.$refs.materialArea.bar.destroy(); 
            this.$refs.materialArea.bar = new Chart(this.$refs.material, {
                type: "bar",
                data: {
                    labels: date,
                    datasets: [{
                        label: "當日使用量",
                        backgroundColor: "rgba(54, 162, 235, 0.4)",
                        borderColor: "rgba(54, 162, 235, 0.8)",
                        fill:"rgba(54, 162, 235, 0.3)",
                        borderWidth: 2,
                        data: useSum
                    }, {
                        label: "至前一筆累計量",
                        backgroundColor: "rgba(118, 163, 158, 0.3)",
                        borderColor: "rgba(118, 163, 158, 0.5)",
                        fill:"rgba(118, 163, 158, 0.3)",
                        borderWidth: 2,
                        data: totalSum
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
                                color: 'white',
                                fontSize: 16,
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
                                fontSize: 14  //更改x軸文字顏色
                            },
                            grid: {
                                color: 'grey' 
                            }
                        }
                    },
                },
            });
        },
        async refresh() {
            let start = this.datepickerRange[0];
            let end = this.datepickerRange[1];
            
            let sendData = {
                start_date: start,
                end_date: end
            }
            const rsData = await callapi.getMaterialChartData(sendData, this.projectUid);
            if(rsData) {
                this.materialList = rsData;
            }
        },
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
   
        this.refresh();
    },    
}
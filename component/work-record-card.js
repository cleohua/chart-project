//點工原因統計
var template = /*html*/ `
<div id="work-record-card">
    <div class="work-title">
        <div class="title-text-work">點工原因統計</div>
    </div>
    <div class="choose-date">
        <div class="datepicker">
            <div class="datepicker-for-day">
                <i class="fa fa-calendar"></i>
                <date-range-picker 
                    v-model="rangeForDay" 
                    :min="startDate"
                    :max="forToday" 
                    @input="searchDay" 
                />
            </div>
        </div>
        <div 
            class="project-satrt-date" 
            @click="fromStartDate"
        >
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
            專案起訖
        </div>
    </div>
    <div class="work-record-main">
        <div class="flex-wrapper">
            <canvas ref="donut" width="300" height="300"></canvas>
            <div class="total-count-text">
                <div>人數總計</div>
                <div class="total-num">{{totalCount}}人</div>
            </div>
        </div>
        <div class="chart-info-wrapper">
            <div 
                v-for="(item, index) in chartInfoList" 
                class="chart-info"
            >
                <div :style="{ background: chartColor[index] }" class="chart-color"></div>
                <div class="chart-name">{{ item.timeWorkReason }} {{ item.count }}人 ({{limitPersent(item.count, item.limitPerson)}}%)</div>
            </div>
        </div>
    </div>
</div>
`

import * as callapi from "../callAPI.js";
export default {
    name: 'work-record-card',
    template,
    components: {'date-range-picker': VueDatepicker.DateRangePicker },
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
            today: new Date().toLocaleDateString('en-CA'),
            rangeForDay: [],
            forToday: '',
            startDate: '',
            endDate: '',
            projectUid: !this.project ? this.projectid : this.project,
            chartInfoList: [],
            totalCount: '',
            chartColor: [
                'rgb(207, 103, 103, 0.7)', 
                'rgb(207, 153, 103, 0.7)',
                'rgb(207, 197, 103, 0.7)',
                'rgb(161, 207, 103, 0.7)',
                'rgb(103, 201, 207, 0.7)',
                'rgb(149, 103, 207, 0.7)',
            ],
        }
    },
    methods: {
        limitPersent(count,limitPerson) {
            const persent = limitPerson / count;
            return persent.toFixed(1);
        },
        searchDay() {
            this.refresh();
        },
        async fromStartDate() {
            this.rangeForDay[0] = this.startDate;
            this.rangeForDay[1] = this.forToday;
            this.refresh();
        },
        async refresh() {
            // let sendData = {
            //     start_date: this.rangeForDay[0],
            //     end_date: this.rangeForDay[1],
            // }
            const count = this.chartInfoList.map(i => i.count);
            const itemName = this.chartInfoList.map(i => i.timeWorkReason);
            const totalNum = count.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            this.totalCount = Number.isInteger(totalNum) ? totalNum + ".0" : totalNum ;
            
            let option = {
                responsive: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                }, 
                cutout: 110,
            };

            let datas = {
                labels: itemName,
                datasets: [{
                    data: count,
                    backgroundColor: this.chartColor,
                    borderWidth: 10, // 设置扇形之间的间距
                    borderColor: '#333333',
                }],
            }
            
            const ctx = this.$refs.donut.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                options: option,
                data: datas
            });
        },
    },
    async created() {
        const today = new Date();
        let year = today.getFullYear(); 
        let month = today.getMonth() + 1; 
        let day = today.getDate();
        let dayMonth = month -1;
        month < 10 ? month = "0" + month : month;
        day < 10 ?  day = "0" + day : day;
        dayMonth < 10 ? dayMonth = "0" + dayMonth : dayMonth;
        this.forToday = year + "-" + month + "-" + day;
        this.rangeForDay = [year + "-" + dayMonth + "-" + day, year + "-" + month + "-" + day];

        const satrtDate = await callapi.getProgressInfoData(this.projectUid);
        this.startDate = satrtDate.start_date;
        const rsData = await callapi.getDayWorkReason();
        this.chartInfoList = rsData.sort((a, b) => b.count - a.count);;

        this.refresh();
    }
}
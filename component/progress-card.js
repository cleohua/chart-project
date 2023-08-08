//施工進度
var template = /*html*/ `
<div 
    id="doughnut-card"
    class="card"
>
    <div class="title-text">施工進度</div>
    <div class="type-title">進度類型：{{dataType}}</div>
    <div class="doughnut">
        <div class="doughnut-main">
            <canvas class="estimatedProgress" width="267" height="267" ref="outside"></canvas>
            <canvas class="progress-canvas" width="232" height="232" ref="inside"></canvas>
            <div class="progress-text">
                <div class="baseline">預計進度{{expectSchedule}}%</div>
                <div class="progress-number">{{realSchedule}}%</div>
                <div class="schedule">{{schedule}}%</div>
            </div>
        </div>
    </div>
    <div class="schedule-date">
        <div class="start-date">開工起日：{{progressInfoList.start_date}}</div>
        <div class="end-date">完工迄日：{{progressInfoList.finish_date}}</div>
    </div>
</div>
`
import * as callapi from "../callAPI.js";
export default {
    name: 'doughnut-card',
    template,
    props: {
        project: {
            type: String
        },
        projectid: {
            type: String
        },
        currenttype: {
            type: Number
        },
    },
    data() { 
        return {
            scheduleData: [],
            expectSchedule: null,
            realSchedule: null,
            today: new Date().toLocaleDateString('en-CA'),
            progressInfoList: [],
            projectUid: !this.project ? this.projectid : this.project,
            progressType: '',
            dataType: '',
            projectType: '',
            companyType: '',
            testType: '',
            
        }
    },
    watch: {
        async currenttype(val) {
            this.testType = await callapi.setDefaultDataType(val, this.projectUid);
            this.refresh();
        }
    },
    computed: {
        schedule() {
            const result = this.realSchedule - this.expectSchedule;
            return result > 0 ? '+' + result : result.toFixed(2);
        },
    },
    methods: {
        async refresh() {
            const datatype = await callapi.getDefaultDataType(this.projectUid);
            const progressTypes = {
                1: '排程進度',
                2: '配當進度',
                3: '預算進度',
                4: '要徑進度'
            };
            this.dataType = progressTypes[datatype] || '';

            let sendData ={
                date: this.today
            }
            const projectSchedule = await callapi.getProgressDayData(sendData, this.projectUid);
            // this.progressInfoList = peojectInfo;

            if(this.companyType !== 3) {
                this.expectSchedule = projectSchedule.expect_schedule.toFixed(2);
                this.realSchedule = projectSchedule.real_schedule.toFixed(2);
            }else {
                this.expectSchedule = projectSchedule.valuation_expect_schedule.toFixed(2);
                this.realSchedule = projectSchedule.valuation_real_schedule.toFixed(2);
            }

            if(this.$refs.inside.bar != undefined) 
            this.$refs.inside.bar.destroy(); 
            const ctx = this.$refs.inside.getContext('2d');
            const ctx2 = this.$refs.outside.getContext('2d');

            //第一個甜甜圈
            const backgroundColor = '#ECCE2A' 
            this.$refs.inside.bar = new Chart(ctx, {
                type: 'doughnut',
                options: {
                    responsive: false,
                    cutout: 95,  
                },
                data: {
                    datasets: [{
                        label: "預計進度",
                        data: [this.realSchedule, 100 - this.realSchedule],
                        backgroundColor: [
                            backgroundColor, 
                            '#333333',
                        ],
                        borderWidth: 0,
                    }]
                },
            });

            if(this.$refs.outside.bar != undefined) 
            this.$refs.outside.bar.destroy(); 
            //第二個甜甜圈
            const background = '#7c7c7c' 
            this.$refs.outside.bar = new Chart(ctx2, {
                type: 'doughnut',
                options: {
                    responsive: false,
                    cutout: 100,
                },
                data: {
                    datasets: [{
                        label: "實際進度",
                        data: [this.expectSchedule, 100 - this.expectSchedule],
                        backgroundColor: [
                            background, 
                            '#424242',
                        ],
                        borderWidth: 0,
                    }]
                },
            });
        },
    },
    async mounted() {
        this.companyType = await callapi.getDefaultDataType(this.projectUid); 
        this.progressInfoList = await callapi.getProgressInfoData(this.projectUid);
        if(userLoginInfo.isProject == false) {
            this.refresh();
        }
    },
}
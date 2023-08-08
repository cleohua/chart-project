//本週工項
var template = /*html*/ `
<div
    id="weekly-work-card"
>
    <div class="title-text">累計至本週之工項</div>
    <div
        class="weekly-main"
    >
        <div 
            class="expect-work"
        >
            <div
                class="expect-main"
            >   
                <div class="weekly-text">預計完成工項</div>
                <div
                    class="expect-title"
                >
                    <div class="title-no">項次</div>
                    <div class="title-work">工項</div>
                    <div class="title-expect">預計進度</div>
                    <div class="title-schedule">實際進度</div>
                </div>
                <div 
                    class="expect-main-count" 
                    v-if="expectList.length > 0"
                >
                    <div 
                        v-for="(card, index) in expectList"
                        :key="index"
                        class="expect-table"
                    >
                        <div class="expect-no">{{index + 1}}</div>
                        <div class="expect-type">{{card.item.name}}</div>
                        <div class="expect-num">{{getExpect}} %</div>
                        <div class="expect-schedule">
                            <p class="expect-actual" v-if="card.actual === null">{{0}} %</p>
                            <p class="expect-actual" v-else>{{card.actual[card.actual.length - 1].finish}} %</p>
                        </div>
                    </div>
                </div>
                <div 
                    class="expect-text" 
                    v-else="expectList.length == 0"
                >暫無預計完成工項</div>
            </div>
        </div>
        <div 
            class="expect-work"
        >
            <div
                class="expect-main"
            >   
                <div class="weekly-text">提早施作工項</div>
                <div
                    class="expect-title"
                >
                    <div class="title-no">項次</div>
                    <div class="title-work">工項</div>
                    <div class="title-expect">預計進度</div>
                    <div class="title-schedule">實際進度</div>
                </div>
                <div 
                    class="expect-main-count"  
                    v-if="earlyList.length > 0"
                >
                    <div 
                        v-for="(card, index) in earlyList"
                        :key="index"
                        class="expect-table"
                    >
                        <div class="expect-no">{{index + 1}}</div>
                        <div class="expect-type">{{card.item.name}}</div>
                        <div class="expect-num">0 %</div>
                        <div class="expect-schedule">{{card.actual[card.actual.length - 1].finish}} %</div>
                    </div>
                </div>
                <div 
                    class="expect-text" 
                    v-else="earlyList.length == 0"
                >暫無提早施作工項</div>
            </div>
        </div>
        <div 
            class="overdue-work"
        >
            <div
                class="overdue-main"
            >   
                <div class="weekly-text">逾期完成工項</div>
                <div
                    class="expect-title"
                >
                    <div class="title-no">項次</div>
                    <div class="title-work">工項</div>
                    <div class="title-expect">預計進度</div>
                    <div class="title-schedule">實際進度</div>
                </div>
                <div 
                    class="overdue-main-count"
                    v-if="overdueList.length > 0"
                >
                    <div 
                        v-for="(card, index) in overdueList"
                        :key="index"
                        class="overdue-table"
                        
                    >
                        <div class="overdue-no">{{index + 1}}</div>
                        <div class="overdue-type">{{card.item.name}}</div>
                        <div class="overdue-num">
                            {{getExpect(card.expect)}} %
                        </div>
                        <div 
                            class="overdue-schedule"
                        >
                            <p class="expect-actual" v-if="card.actual === null">{{0}} %</p>
                            <p class="expect-actual" v-else>{{card.actual[card.actual.length - 1].finish}} %</p>
                        </div>
                    </div>
                </div>
                <div 
                    class="expect-text" 
                    v-else="overdueList.length == 0"
                >暫無逾期完成工項</div>
            </div>
        </div>
    </div>
</div>
`
import * as callapi from "../callAPI.js";
export default {
    name: 'weekly-work-card',
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
            expectData: [],
            overdueList: [],
            expectList: [],
            earlyList: [],
            sunday: '',
            projectUid: !this.project ? this.projectid : this.project,
        }
    },
    methods: {
        async start() { 
            const rsData = await callapi.getProcessData(this.projectUid);
            if (rsData.length !== 0) {
                this.expectData = rsData;
            }else {
                this.expectData = [];
            }

            //篩選本週在起迄日期內
            const myFilteredArray = this.expectData.filter(item => {
                const startDate = new Date(item.start_date).toISOString();
                const weekSunday = new Date(this.sunday).toISOString();
                const endDate = new Date(item.end_date).toISOString();
                return startDate < weekSunday && endDate > weekSunday;
            });
            
            //篩選出實際進度尚未100%的物件
            if(myFilteredArray.length > 0) {
                this.expectList = myFilteredArray.filter(data => {
                    if (data.actual) {
                        return data.actual.slice(-1)[0].finish !== 100;
                    } else {
                        return true;
                    }
                });
            }else {
                this.expectList = [];
            }

            //預計進度大於實際進度
            const overdue = this.expectList.filter((data) => {
                if(this.expectList.length > 0) {
                    if (!data.actual) {
                        return true;
                    }
                    const lastFinishValue = data.actual[data.actual.length - 1].finish;
                    console.log(data.expect);
                    return data.expect[this.sunday] > lastFinishValue;
                }
            });

            //實際進度大於預計進度
            const expect = this.expectList.filter((data) => {
                if (!data.actual) {
                  return false;
                }
                const lastFinishValue = data.actual[data.actual.length - 1].finish;
                console.log(data.expect);
                return data.expect[this.sunday] < lastFinishValue;
            });
            this.expectList = expect;

            //篩選出起日早於本週的物件(提早施做)
            const earlyOFDayArray = this.expectData.filter(item => {
                const startDate = new Date(item.start_date).toISOString();
                const weekSunday = new Date(this.sunday).toISOString();
                return startDate > weekSunday;
            });
 
            //篩選出提早施做項目裡已有實際進度的物件
            const earlyItem = earlyOFDayArray.filter(data => {
                if (data.actual) {
                    return data.actual.slice(-1)[0].finish !== 100;
                } else {
                    return false;
                }
            });
            this.earlyList = earlyItem;

            //篩選出迄日晚於今天的物件(已逾期)
            const overdueArray = this.expectData.filter(item => {
                const endDate = new Date(item.start_date).toISOString();
                const today = new Date().toISOString();
                return endDate < today;
            });

            //篩選出已逾期裡實際進度尚未100%的物件
            const dayOfOverdue = overdueArray.filter(data => {
                if (data.actual) {
                    return data.actual.slice(-1)[0].finish !== 100;
                } else {
                    return true;
                }
            });
            this.overdueList = overdue.concat(dayOfOverdue);
        },
        getExpect(obj) {
            if (obj) {
                const keys = Object.keys(obj);
                const sundayExpect = keys[this.sunday];
                if(sundayExpect == undefined) { 
                    return obj[keys[keys.length - 1]].toFixed(2);
                }else{
                   return sundayExpect;
                } 
            }
            return 0;
        },
    },
    mounted() {
        let thisWeekSunday = moment().day(7)._d;
        let day = thisWeekSunday.getDate();
        let month = thisWeekSunday.getMonth() + 1;
        let year = thisWeekSunday.getFullYear();
        month < 10 ? month = "0" + month : month;
        day < 10 ?  day = "0" + day : day;
        this.sunday = year + '-' + month + '-' + day;

        this.start();
    },
}
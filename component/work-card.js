//出工
var template = /*html*/ `
<div 
    id="work-card" 
    class="card"
    :style="workStyle"
>
    <div class="work-title">
        <div class="title-text-work">出工統計</div>
        <div class="search-area">
            <div  
                class="form-table"
                @click="showPopupWork"
            >
                <i class="fa fa-search"></i>
                <div>進階搜尋</div>
            </div>
            <div 
                v-if="showPopup" 
                class="popup" 
                ref="popup"
            >
                <div class="datepicker-for-day">
                    <i
                        class="fa fa-calendar" 
                    ></i>
                    <date-range-picker
                        v-model="rangeForDay"
                        :max="forToday"
                        @input="searchDay"
                    />
                </div>
                <div class="search-input-work">
                    <div>
                        廠商：<input type="search" v-model="supplyKeyWord" placeholder="請輸入廠商名稱"/>
                    </div>
                    <div>
                        工種：<input type="search" v-model="typeKeyWord" placeholder="請輸入工種名稱"/>
                    </div>
                </div>
                <div class="dialog-btn">
                    <p 
                        class="search" 
                        type="submit" 
                        @click="searchItem"
                    >
                        搜尋
                    </p>
                    <p 
                        class="close-work"
                        @click="showPopup = false"
                    >
                        關閉
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div 
        class="date-text"
    >
        {{startDate}} 至 {{endDate}}
    </div>
    <div class="people-headcount">
        <div class="headcount-number">總出工數：{{headcount}}人</div>
    </div>
    <div
        class="work-main"
    >
        <div
            class="table-title"
        >   
            <div class="title-supply">廠商名稱</div>
            <div class="title-type">工種</div>
            <div class="title-headcount">出工數</div>
        </div>
        <div class="main-count" v-show="this.tableData.length !== 0">
            <div 
                v-for="(card, index) in tableData"
                :key="index"
                class="work-table"
            >   
                <div class="main-supply">{{card.supplyName}}</div>
                <div class="main-type">{{card.workName}}</div>
                <div class="main-headcount">{{card.count}}人</div>
            </div>
        </div>
        <div 
            class="none-list"
            v-show="this.tableData.length == 0">
            <span>此日期暫無相關資料</span>
        </div>
    </div>
</div>
`
import * as callapi from "../callAPI.js";
export default {
    name: 'work-card',
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
        let date = new Date();
        return {
            tableData: [],
            count: null,
            today: new Date().toLocaleDateString('en-CA'),
            showPopup: false,
            startDate: '',
            endDate: '',
            supplyKeyWord:'',
            typeKeyWord: '',
            rangeForDay: [],
            forToday: '',
            workStyle: {
                position: 'relative'
            },
            projectUid: !this.project ? this.projectid : this.project,
        }
    },
    methods: {
        async searchData() {
            this.refresh();
        },
        showPopupWork() {
            this.showPopup = !this.showPopup;
        },
        closePopup(e) {
            if (this.$refs.popup) {
                if (!this.$refs.popup.contains(e.target)) {
                    this.showPopup = false;
                }
            }
        },
        searchDay() {
            this.refresh();
        }, 
        async refresh() {
            let sendData = {
                start_date: this.rangeForDay[0],
                end_date: this.rangeForDay[1],
            }
            this.startDate = sendData.start_date;
            this.endDate = sendData.end_date;
            // console.log(this.projectUid);
            const rsData = await callapi.getPersonCalculationData(sendData, this.projectUid);

            let filteredArray = [];
            for (let date in rsData) {
                let array = rsData[date];
                for (let i = 0; i < array.length; i++) {
                    let obj = {
                    count: array[i].count,
                    supplyName: array[i].supply.name,
                    workName: array[i].work.name
                    };
                    filteredArray.push(obj);
                }
            }
            this.tableData = filteredArray;
            
            if(this.supplyKeyWord != '' || this.typeKeyWord != '') {
                this.tableData = this.tableData.filter(searchResult => searchResult.supplyName.match(this.supplyKeyWord) && searchResult.workName.match(this.typeKeyWord));
            }
        },
        searchItem() {
            this.refresh();
            this.showPopup = false;
        }
    },
    computed: {
        headcount() {
            if (this.tableData.length !== 0) {
                const arr = this.tableData.map(i => i.count);
                const sum = arr.reduce((acc, curr) => acc + parseInt(curr), 0);
                return sum;
            } else {
                return 0;
            }
        },
    },
    async created() {
        // console.log(this.projectUid);
        const today = new Date();
        let year = today.getFullYear(); 
        let month = today.getMonth() + 1; 
        let day = today.getDate();
        let dayMonth = month -1;
        month < 10 ? month = "0" + month : month;
        day < 10 ?  day = "0" + day : day;
        dayMonth < 10 ? dayMonth = "0" + dayMonth : dayMonth;
        this.rangeForDay = [year + "-" + dayMonth + "-" + day, year + "-" + month + "-" + day];
        this.forToday = year + "-" + month + "-" + day;

        this.refresh();
    }
}
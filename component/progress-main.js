//S-CURVE工程進度圖表
var template = /*html*/ `
<div class="row-dashboard-item-area">
    <div class="dashboard-item-area" id="progress-area" ref="progress">
        <div class="dashboard-item">
            <div class="progress-title"> 
                <div class="progress-btn">
                    <div
                        @click="monthBtnSwitch"
                        :class="{'active': monthBtn}"
                    >
                        S-CURVE工程月單位進度圖表
                    </div>
                    <div
                        @click="dayBtnSwitch"
                        :class="{'active': dayBtn}"
                    >
                        S-CURVE工程日單位進度圖表
                    </div>
                </div>
                <div class="select-btn">
                    <div class="type-btn">
                        <select
                            v-model="currentType"
                        >
                            <option 
                                v-for="(list, index) in typeList"
                                :key="index"
                                :value="index"
                            >
                                {{list.name}}
                            </option>
                        </select>
                    </div>
                    <div
                        class="reset-btn"
                        @click="refreshAll"
                    >全部重置</div>
                    <div 
                        class="export-btn"
                        @click="exportExcel"
                        v-show="monthBtn"
                    >
                        <i class="fa fa-print" aria-hidden="true"></i>
                        <span>匯出</span>
                    </div>
                </div>
            </div>
            <div class="progress-main">
                <div class="progress-data">
                    <div 
                        class="choose-date" 
                        v-show="dayBtn"
                    >
                        <div class="day-area">
                            <i class="fa fa-calendar"></i>
                            <datepicker
                                v-model="datepickerDate"
                                :min="progressInfoList.start_date"
                                :max="forToday"
                                @input="chooseDate"
                            />
                        </div>
                    </div>
                    <div 
                        class="choose-month" 
                        v-show="monthBtn"
                    >
                        <div class="month-area">
                            <i
                                class="fa fa-calendar" 
                            ></i>
                            <datepicker
                                v-model="currentMonth"
                                @input="chooseMonth"
                                :min="minMonth"
                                :max="maxMonth"
                                type="month"
                            />
                        </div>
                    </div>
                    <div 
                        class="progress-area" 
                        style="display: flex;"
                        :data="progressInfoList"
                    >
                        <div class="progress-day-data" v-show="dayBtn">
                            <div>當日預定執行預算：{{nowExpected}}</div>
                            <div>當日實際執行預算：{{nowActual}}</div>
                        </div>
                        <div class="progress-day-data" v-show="monthBtn">
                            <div>當月預定執行預算：{{nowExpectedForMonth}}</div>
                            <div>當月實際執行預算：{{nowActualForMonth}}</div>
                        </div>
                        <div class="progress-day-data" v-show="dayBtn">
                            <div>累計預定進度：{{cumulateExpected}} %</div>
                            <div>累計實際進度：{{cumulateActual}} %</div>
                            <div>累計進度比較：{{cumulateCompare}} %</div>
                        </div>
                        <div class="progress-day-data" v-show="monthBtn">
                            <div>累計預定進度：{{cumulateExpectedForMonth}} %</div>
                            <div>累計實際進度：{{cumulateActualForMonth}} %</div>
                            <div>累計進度比較：{{cumulateCompareForMonth}} %</div>
                        </div>
                        <div class="progress-day-data">
                            <div>開工時間：{{progressInfoList.start_date}}</div>
                            <div>完工時間：{{progressInfoList.finish_date}}</div>
                        </div>
                        <div class="progress-day-data">
                            <div>施工總工期：{{progressInfoList.total_duration}} 天</div>
                            <div>累計工期：{{progressInfoList.current_duration}} 天 ({{currentDurationtotalPercent}})</div>
                            <div>剩餘工期：{{remainDuration}} 天 ({{remainDurationPercent}})</div>
                        </div>
                    </div>
                </div>
                <div class="dashboard-content" id="dashboard-chart">
                    <div class="date-picker">
                        <div 
                            class="select-month" 
                            v-show="monthBtn"
                        >
                            <div class="select-month-area">
                                <i
                                    class="fa fa-calendar" 
                                ></i>
                                <datepicker
                                    v-model="currentStartMonth"
                                    @input="chooseStartMonth"
                                    :min="minMonth"
                                    :max="currentEndMonth"
                                    type="month"
                                />
                                <div class="right-icon">至</div>
                                <datepicker
                                    v-model="currentEndMonth"
                                    @input="chooseStartMonth"
                                    :min="currentStartMonth"
                                    :max="maxMonth"
                                    type="month"
                                />
                            </div>
                        </div>		
                        <div
                            class="select-day"
                            v-show="dayBtn" 
                        >
                            <div class="datepicker-for-day">
                                <i
                                    class="fa fa-calendar" 
                                ></i>
                                <date-range-picker
                                    v-model="rangeForDay"
                                    :min="progressInfoList.start_date"
                                    :max="forToday"
                                    @input="searchDay"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="chart-area">
                        <span>{{chartText}}</span>
                        <div 
                            class="month-chart"
                            :class="{'loading': loading}"
                        >
                            <canvas width="120" height="50" ref="canvas"></canvas>
                        </div>
                        <span>累計進度百分比</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`

import * as callapi from "../callAPI.js";
export default {
    name: 'progress-area',
    components: { 'datepicker': VueDatepicker.Datepicker, 'date-range-picker': VueDatepicker.DateRangePicker },
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
        let date = new Date();
        return {
            rangeForDay: [],
            startMonth: null,
            endMonth: null,
            defultData: null,
            monthBtn: true,
            dayBtn: false,
            monthMenu: false,
            typeList: [
                {
                    name: '排程進度',
                    index: 0
                },
                {
                    name: '配當進度',
                    index: 1
                },
                {
                    name: '預算進度',
                    index: 2
                },
                {
                    name: '要徑進度',
                    index: 3
                },
            ],
            currentType: '',
            labelList: [],
            labelListForMonth: [],
            today: date,
            forToday: '',
            progressInfoList: {},
            datepickerDate: '',
            remainDuration: '',
            remainDurationPercent: '',
            currentDurationtotalPercent: '',
            nowExpected: '', //當日預定執行預算
            nowExpectedForMonth: '', //當月預定執行預算
            nowActual: '', //當日實際執行預算
            nowActualForMonth: '', //當月實際執行預算
            cumulateExpected: '', //累計預定進度(日)
            cumulateExpectedForMonth: '',//累計預定進度(月)
            cumulateActual: '', //累計實際進度(日)
            cumulateActualForMonth: '',//累計實際進度(月)
            cumulateCompare: '', //累計進度比較(日)
            cumulateCompareForMonth: '',//累計進度比較(月)
            currentMonth: '',
            currentStartMonth: '',
            currentEndMonth: '',
            minMonth: '',
            maxMonth: '',
            loading: true,
            projectUid: !this.project ? this.projectid : this.project,
        }
    },
    watch: {
        currentType(index) {
            this.selectTypeBtn();
            // this.setType(index);
            this.currentType = index;
            this.dayBtn == true ? this.refreshForDay() : this.refreshForMonth();
        }
    },
    computed: {
        chartText() {
            return this.monthBtn ? '月進度執行預算' : '日進度執行預算';
        },
    },
    methods: {
        // async setType(index) {
        //     this.currentType = index;
        //     console.log(this.currentType);
        //     await callapi.setDefaultDataType(this.currentType + 1, this.projectUid);
        // },
        selectTypeBtn() {
            this.$emit('update', this.currentType);
        },
        async chooseMonth() {
            const newMonth = this.currentMonth.replace("-", "/");
            const currencyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            let sendData = {
                start_date: newMonth,
                end_date: newMonth,
            }
            let rsData = await callapi.getProgressMonthData(sendData, this.projectUid);
            if(rsData.length == 2) {
                const monthData = rsData[1];
                this.nowExpectedForMonth = monthData[1] == 0 ? 0 : currencyFormatter.format(monthData[1]);
                this.nowActualForMonth = monthData[2]== 0 ? 0 : currencyFormatter.format(monthData[2]);;
                this.cumulateExpectedForMonth = monthData[3] == 0 ? 0 : (monthData[3] * 100).toFixed(2);
                this.cumulateActualForMonth = monthData[4] == 0 ? 0 : (monthData[4] * 100).toFixed(2);
                this.cumulateCompareForMonth = (this.cumulateActualForMonth - this.cumulateExpectedForMonth).toFixed(2);
            }else {
                this.nowExpectedForMonth = '尚無記錄';
                this.nowActualForMonth = '尚無記錄';
                this.cumulateExpectedForMonth = '-';
                this.cumulateActualForMonth = '-';
                this.cumulateCompareForMonth = '-';
            }
        },
        chooseStartMonth() {
           this.refreshForMonth(); 
        },
        chooseEndMonth() {
            this.refreshForMonth();
        },
        async chooseDate() {
            let dateParts = this.datepickerDate.split("-");
            let year = dateParts[0];
            let month = dateParts[1];
            let day = dateParts[2];
            let formattedDateForDay = `${year}/${month}/${day}`;
            const currencyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            let sendData = {
                start_date: formattedDateForDay,
                end_date: formattedDateForDay,
            }
            const rsData = await callapi.getProgressDayData(sendData, this.projectUid);
            if(rsData.length == 3) {
                const dateData = rsData[2];
                this.nowExpected = dateData[1] == 0 ? 0 : currencyFormatter.format(dateData[1]);
                this.nowActual = dateData[2] == 0 ? 0 : currencyFormatter.format(dateData[2]);
                this.cumulateExpected = dateData[3] == 0 ? 0 : (dateData[3] * 100).toFixed(2);
                this.cumulateActual = dateData[4] == 0 ? 0 : (dateData[4] * 100).toFixed(2);
                this.cumulateCompare = (this.cumulateActual - this.cumulateExpected).toFixed(2);
            }else {
                this.nowExpected = '尚無記錄';
                this.nowActual = '尚無記錄';
                this.cumulateExpected = '-';
                this.cumulateActual = '-';
                this.cumulateCompare = '-';
            }
        },
        searchDay() {
           this.refreshForDay();
        },
        monthBtnSwitch() {
            this.monthBtn = true;
            this.dayBtn = false;
            this.refreshForMonth();
        },
        dayBtnSwitch() {
            this.dayBtn = true;
            this.monthBtn = false;
            this.refreshForDay();
        },
        exportExcel() {
            callapi.downloadSCurveReport(this.projectUid);
        },
        async refreshAll() {
            let year = this.today.getFullYear(); 
            let month = this.today.getMonth() + 1; 
            let day = this.today.getDate();
            let dayMonth = month -1;
            let startMonth = month -3;
            month < 10 ? month = "0" + month : month;
            day < 10 ?  day = "0" + day : day;
            dayMonth < 10 ? dayMonth = "0" + dayMonth : dayMonth;
            startMonth < 10 ? startMonth = "0" + startMonth : startMonth;

            this.maxMonth = year + "-" + month;
            this.currentMonth = year + "-" + month;
            this.datepickerDate = year + "-" + month + "-" + day;
            this.currentStartMonth = year + "-" + startMonth;
            this.currentEndMonth = year + "-" + month;
            this.rangeForDay = [year + "-" + dayMonth + "-" + day, year + "-" + month + "-" + day];

            this.progressInfoList = await callapi.getProgressInfoData(this.projectUid);
            let dateParts = this.progressInfoList.start_date.split("-");
            this.minMonth = dateParts[0] + "-" + dateParts[1];
            this.remainDuration = Math.abs(this.progressInfoList.remain_duration);
            this.remainDurationPercent = ((this.remainDuration / this.progressInfoList.total_duration) * 100).toFixed(2) + "%";
            this.currentDurationtotalPercent = ((this.progressInfoList.current_duration / this.progressInfoList.total_duration) * 100).toFixed(2) + "%";

            this.monthBtn == true? this.refreshForMonth() : this.refreshForDay();
        },
        async refreshForDay() {
            this.loading = true;
            const type = await callapi.setDefaultDataType(this.currentType + 1, this.projectUid);
            let dateParts = this.datepickerDate.split("-");
            let year = dateParts[0];
            let month = dateParts[1];
            let day = dateParts[2];
            let formattedDate = `${year}/${month}/${day}`;
            const currencyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });

            let sendData = {
                date: formattedDate,
                
            }
            const rsData = await callapi.getProgressDayData(sendData, this.projectUid);
            if(rsData.length == 3) {
                const dateData = rsData[2];
                this.nowExpected = dateData[1] == 0 ? 0 : currencyFormatter.format(dateData[1]);
                this.nowActual = dateData[2] == 0 ? 0 : currencyFormatter.format(dateData[2]);
                this.cumulateExpected = dateData[3] == 0 ? 0 : (dateData[3] * 100).toFixed(2);
                this.cumulateActual = dateData[4] == 0 ? 0 : (dateData[4] * 100).toFixed(2);
                this.cumulateCompare = (this.cumulateActual - this.cumulateExpected).toFixed(2);
            }else {  
                this.nowExpected = '尚無記錄';
                this.nowActual = '尚無記錄';
                this.cumulateExpected = '-';
                this.cumulateActual = '-';
                this.cumulateCompare = '-';
            }
            if(this.dayBtn == true && type) {
                let formattedDates = this.rangeForDay.map(dateString => {
                    let dateParts = dateString.split('-');
                    let year = dateParts[0];
                    let month = dateParts[1];
                    let day = dateParts[2];
                    return `${year}/${month}/${day}`;
                });
                let sendDataForDay = {
                    start_date: formattedDates[0],
                    end_date: formattedDates[1],
                }
                const dayData = await callapi.getProgressDayData(sendDataForDay, this.projectUid);
                const dateArr = dayData.map(subArr => subArr[0]).slice(1);
                const listArr = dayData[0];
                this.labelList = listArr.slice(1);
                const dataListForProgress = dayData.map(subArray => subArray.slice(1));
                const newData = dataListForProgress.reduce((acc, cur) => {
                    for (let i = 0; i < cur.length; i++) {
                        if (!acc[i]) {
                            acc[i] = [];
                        }
                        acc[i].push(cur[i]);
                    }
                    return acc;
                }, []);

                const progressData = newData.map(subArray => subArray.slice(1));
                const progressActual = progressData[2].map(num => num);
                const progressReal = progressData[3].map(num => num);
                let chartData = {
                    labels: dateArr,
                    datasets: [{
                        type:'bar',
                        label: this.labelList[0],
                        backgroundColor: "rgba(54, 162, 235, 0.4)",
                        borderColor: "rgba(54, 162, 235, 0.8)",
                        yAxisID: 'y',
                        borderWidth: 1,
                        data: progressData[0],
                    },
                    {
                        type:'bar',
                        label: this.labelList[1],
                        backgroundColor: "rgb(130, 159, 106, 0.4)",
                        borderColor: "rgba(130, 159, 106, 0.8)",
                        yAxisID: 'y',
                        borderWidth: 1,
                        data: progressData[1],
                    },
                    {
                        type: 'line',
                        label: this.labelList[2],
                        borderColor: "rgb(255, 99, 71, 0.7)",
                        fill: false,
                        lineTension: 0, // 曲線的彎度，設 0 表示直線
                        yAxisID: 'y1',
                        borderWidth: 2,
                        data: progressActual,
                    },
                    {
                        type: 'line',
                        label: this.labelList[3],
                        borderColor: "rgb(255, 231, 93, 0.7)",
                        fill: false,
                        lineTension: 0, // 曲線的彎度，設 0 表示直線
                        yAxisID: 'y1',
                        borderWidth: 2,
                        data: progressReal,
                    }]
                };

                if(this.$refs.progress.bar != undefined) 
                this.$refs.progress.bar.destroy(); 
                this.$refs.progress.bar = new Chart(this.$refs.canvas, {
                    type: "bar",
                    data: chartData,
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
                                position: 'left',
                                display: true,
                                ticks: {
                                    beginAtZero: true,
                                    color: '#e2e2e2',
                                    fontSize: 16,
                                    callback: function(value, index, values) {
                                        return value; 
                                    }        
                                },
                                grid: {
                                    color: 'grey' 
                                },
                            }, 
                            y1 :{
                                position: 'right',
                                display: true,
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 20,
                                    color: '#e2e2e2',
                                    fontSize: 16,
                                    callback: function(value, index, values) {
                                        return value + '%'; 
                                    }        
                                },
                                grid: {
                                    color: 'grey' 
                                },
                            },
                            x: {
                                ticks: {
                                    color: '#e2e2e2',
                                    fontSize: 14 
                                },
                                grid: {
                                    color: 'grey'
                                }
                            },
                          
                        },
                        legend: {
                            labels: {
                                fontColor: "#e2e2e2",
                                fontSize: 14
                            }
                        },
                        barPercentage: 0.7, 
                        categoryPercentage: 0.6
                    },
                });
            }

            this.loading = false;
        },
        async refreshForMonth() {
            this.loading = true;
            const type = await callapi.setDefaultDataType(this.currentType + 1, this.projectUid);
            const searchMonth = this.currentMonth.replace("-", "/");
            const searchStartMonth = this.currentStartMonth.replace("-", "/");
            const searchEndMonth = this.currentEndMonth.replace("-", "/");
            const currencyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            let sendData = {
                start_date: searchMonth,
                end_date: searchMonth,
            }
            const rsData = await callapi.getProgressMonthData(sendData, this.projectUid);
            if(rsData.length == 2) {
                const monthData = rsData[1];
                this.nowExpectedForMonth = monthData[1] == 0 ? 0 : currencyFormatter.format(monthData[1]);
                this.nowActualForMonth = monthData[2] == 0 ? 0 : currencyFormatter.format(monthData[2]);
                this.cumulateExpectedForMonth = monthData[3] == 0 ? 0 : (monthData[3] * 100).toFixed(2);
                this.cumulateActualForMonth = monthData[4] == 0 ? 0 : (monthData[4] * 100).toFixed(2);
                this.cumulateCompareForMonth = (this.cumulateActualForMonth - this.cumulateExpectedForMonth).toFixed(2);
            }else {
                this.nowExpectedForMonth = '尚無記錄';
                this.nowActualForMonth = '尚無記錄';
                this.cumulateExpectedForMonth = '-';
                this.cumulateActualForMonth = '-';
                this.cumulateCompareForMonth = '-';
            }

            if(this.monthBtn == true && type) {
                let sendDataForDay = {
                    start_date: searchStartMonth,
                    end_date: searchEndMonth,
                }
                const monthData = await callapi.getProgressMonthData(sendDataForDay, this.projectUid);
                const monthArr = monthData.map(subArr => subArr[0]).slice(1);
                const listArr = monthData[0];
                this.labelListForMonth = listArr.slice(1);
                const dataListForProgress = monthData.map(subArray => subArray.slice(1));
                const newData = dataListForProgress.reduce((acc, cur) => {
                    for (let i = 0; i < cur.length; i++) {
                        if (!acc[i]) {
                            acc[i] = [];
                        }
                        acc[i].push(cur[i]);
                    }
                    return acc;
                }, []);

                const progressData = newData.map(subArray => subArray.slice(1));
                const progressActual = progressData[2].map(num => num);
                const progressReal = progressData[3].map(num => num);
                let chartData = {
                    labels: monthArr,
                    datasets: [{
                        type:'bar',
                        label: this.labelListForMonth[0],
                        backgroundColor: "rgba(54, 162, 235, 0.4)",
                        borderColor: "rgba(54, 162, 235, 0.8)",
                        yAxisID: 'y',
                        borderWidth: 1,
                        data: progressData[0],
                    },
                    {
                        type:'bar',
                        label: this.labelListForMonth[1],
                        backgroundColor: "rgb(130, 159, 106, 0.4)",
                        borderColor: "rgba(130, 159, 106, 0.8)",
                        yAxisID: 'y',
                        borderWidth: 1,
                        data: progressData[1],
                    },
                    {
                        type: 'line',
                        label: this.labelListForMonth[2],
                        borderColor: "rgb(255, 99, 71, 0.7)",
                        fill: false,
                        lineTension: 0, 
                        borderWidth: 2,
                        yAxisID: 'y1',
                        data: progressActual,
                    },
                    {
                        type: 'line',
                        label: this.labelListForMonth[3],
                        borderColor: "rgb(255, 231, 93, 0.7)",
                        fill: false,
                        lineTension: 0, 
                        borderWidth: 2,
                        yAxisID: 'y1',
                        data: progressReal,
                    }]
                };

                if(this.$refs.progress.bar != undefined) 
                this.$refs.progress.bar.destroy();
                this.$refs.progress.bar = new Chart(this.$refs.canvas, {
                    type: "bar",
                    data: chartData,
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
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    fontSize: 16,
                                    color: '#e2e2e2',
                                    callback: function(value, index, values) {
                                        return value; 
                                    }        
                                },
                                grid: {
                                    color: 'grey' 
                                },
                            }, 
                            y1: {
                                position: 'right',
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 20,
                                    color: '#e2e2e2',
                                    fontSize: 16,
                                    callback: function(value, index, values) {
                                        return value + '%'; 
                                    }        
                                },
                                grid: {
                                    color: 'grey'
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#e2e2e2',
                                    fontSize: 14 
                                },
                                grid: {
                                    color: 'grey' 
                                }
                            },
                            
                        },
                        legend: {
                            labels: {
                                fontColor: "#e2e2e2",
                                fontSize: 14
                            }
                        },
                        barPercentage: 0.7, 
                        categoryPercentage: 0.6 
                    },
                });
            }

            this.loading= false;
        }
    },
    async created() {
        let year = this.today.getFullYear(); 
        let month = this.today.getMonth() + 1; 
        let day = this.today.getDate();
        let dayMonth = month -1;
        let startMonth = month -3;
        month < 10 ? month = "0" + month : month;
        day < 10 ?  day = "0" + day : day;
        dayMonth < 10 ? dayMonth = "0" + dayMonth : dayMonth;
        startMonth < 10 ? startMonth = "0" + startMonth : startMonth;
    
        this.maxMonth = year + "-" + month;
        this.currentMonth = year + "-" + month;
        this.datepickerDate = year + "-" + month + "-" + day;
        this.forToday = year + "-" + month + "-" + day;
        this.currentStartMonth = year + "-" + startMonth;
        this.currentEndMonth = year + "-" + month;
        this.rangeForDay = [year + "-" + dayMonth + "-" + day, year + "-" + month + "-" + day]

        this.currentType = await callapi.getDefaultDataType(this.projectUid) - 1;
        this.progressInfoList = await callapi.getProgressInfoData(this.projectUid);
        let dateParts = this.progressInfoList.start_date.split("-");
        this.minMonth = dateParts[0] + "-" + dateParts[1];
        this.remainDuration = Math.abs(this.progressInfoList.remain_duration);
        this.remainDurationPercent = ((this.remainDuration / this.progressInfoList.total_duration) * 100).toFixed(2) + "%";
        this.currentDurationtotalPercent = ((this.progressInfoList.current_duration / this.progressInfoList.total_duration) * 100).toFixed(2) + "%";
        
        this.refreshForDay();
        this.refreshForMonth();
    },    
}
//出工細項
var template = /*html*/ `
<div 
    class="row-dashboard-item-area"
    id="work-main"
>
    <div class="dashboard-item-area" id="worker-area">
        <div class="dashboard-item">
            <div class="dashboard-title-area">
                <span class="title">施工進度細項</span>
            </div>
            <div 
                class="work-project" 
            >
                <component 
                    v-for="(component, index) in componentList"
                    :is="component"
                    :key="index"
                    :project="project"
                    :projectid="projectid"
                    :currenttype="!component.receiveCurrentType ? currenttype : null"
                >
                </component>
            </div>
        </div>
    </div>
</div>
`
import electricalCard from "./electrical-card.js";
import airQualityCard from "./air-quality-card.js";
import progressCard from "./progress-card.js";
import workCard from "./work-card.js";
import weatherReportCard from "./weather-report-card";
import hotCard from "./hot-card.js";
import weeklyWorkCard from "./weekly-work-card";
import workRecordCard from "./work-record-card.js";

export default {
    name: 'work-main',
    template,
    props: {
        project: {
            type: String
        },
        projectid: {
            type: String
        },
        currenttype: {
            type: Number,
            required: true
        }
    },
    components: {
        'electrical-card': electricalCard,
        'air-quality-card': airQualityCard,
        'progress-card': progressCard,
        'work-card': workCard,
        'weather-report-card': weatherReportCard,
        'hot-card': hotCard,
        'weekly-work-card': weeklyWorkCard,
        'work-record-card': workRecordCard,
    },
    data() {
        return {
            componentData:[
                {
                    components:'electrical-card',
                    show: false,
                    receiveCurrentType: false,
                },
                {
                    components:'air-quality-card',
                    show: false,
                    receiveCurrentType: false,
                },
                {
                    components:'progress-card',
                    show: true,
                    receiveCurrentType: true,
                },
                {
                    components:'work-card',
                    show: true,
                    receiveCurrentType: false,
                },
                {
                    components:'weather-report-card',
                    show: false,
                    receiveCurrentType: false,
                },
                {
                    components:'hot-card',
                    show: false,
                    receiveCurrentType: false,
                },
                {
                    components:'weekly-work-card',
                    show: true,
                    receiveCurrentType: false,
                },
                {
                    components:'work-record-card',
                    show: true,
                    receiveCurrentType: false,
                },
            ],
        }
    },
    watch: {
        currenttype(val) {
            this.currenttype = val;
        }
    },
    computed: {
        componentList() {
            return this.componentData.filter((i) => i.show).map((i) => i.components);
        }
    },
}

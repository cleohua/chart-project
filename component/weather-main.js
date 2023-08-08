//天氣預報
var template = /*html*/ `
<div 
    class="row-dashboard-item-area"
    id="weather-main"
>
    <div class="dashboard-item-area" id="worker-area">
        <div class="dashboard-item">
            <div class="dashboard-title-area">
                <span class="title">天氣預報</span>
            </div>
            <div class="main">
                <component 
                    v-for="(component, index) in componentList"
                    :is="component"
                    :key="index"
                ></component>
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

export default {
    name: 'weather-main',
    template,
    components: {
        'electrical-card': electricalCard,
        'air-quality-card': airQualityCard,
        'progress-card': progressCard,
        'work-card': workCard,
        'weather-report-card': weatherReportCard,
        'hot-card': hotCard,
        'weekly-work-card': weeklyWorkCard,
    },
    data() {
        return {
            componentData:[
                {
                    components:'electrical-card',
                    show: true,
                },
                {
                    components:'air-quality-card',
                    show: true,
                },
                {
                    components:'progress-card',
                    show: false,
                },
                {
                    components:'work-card',
                    show: false,
                },
                {
                    components:'weather-report-card',
                    show: true,
                },
                {
                    components:'hot-card',
                    show: true,
                },
                {
                    components:'weekly-work-card',
                    show: false,
                },
            ],
            componentStyle: {
                width: '29%'
            },
        }
    },
    computed: {
        componentList() {
            return this.componentData.filter((i) => i.show).map((i) => i.components);
        }    
    }
}
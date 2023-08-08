import * as callapi from "./callAPI.js"
import weatherMain from "./component/weather-main.js";
import workMain from "./component/work-main.js";
import progressMain from "./component/progress-main.js";
import issuesCard from "./component/issues-card.js";
import machineCard from "./component/machine-card.js";
import materialCard from "./component/material-card.js";
import stackedCard from "./component/stacked-card.js";
import supervisionCard from "./component/supervision-card.js";

export default async function init(args) {
    callapi.setArgs(args);
    //資訊儀表板
    new Vue({
        el: '#total-list',
        components: {
            'weather-main': weatherMain,
            'work-main': workMain,
            'progress-main': progressMain,
            'issues-card': issuesCard,
            'machine-card': machineCard,
            'material-card': materialCard,
            'stacked-card': stackedCard,
            'supervision-card': supervisionCard,
        },
        data() {
            let isProject = args.isProject;
            let isProxy = args.isProxy;
            let userId = args.user_id;
            let sysCode = args.sys_code;
            return {
                isProject,
                userId,
                isProxy,
                sysCode,
                componentData:[
                    {
                        components:'progress-main',
                        show: true,
                        flex: false,
                        receiveCurrentType: false,
                    },
                    {
                        components:'weather-main',
                        show: true,
                        flex: false,
                        receiveCurrentType: false,
                    },
                    {
                        components:'work-main',
                        show: true,
                        flex: false,
                        receiveCurrentType: true,
                    },
                    {
                        components:'material-card',
                        show: true,
                        flex: true,
                        receiveCurrentType: false,
                    },
                    {
                        components:'machine-card',
                        show: true,
                        flex: true,
                        receiveCurrentType: false,
                    },
                    {
                        components:'stacked-card',
                        show: true,
                        flex: false,
                        receiveCurrentType: false,
                    },
                    {
                        components:'supervision-card',
                        show: true,
                        flex: true,
                        receiveCurrentType: false,
                    },
                    {
                        components:'issues-card',
                        show: true,
                        flex: true,
                        receiveCurrentType: false,
                    },
                ],
                currentType: 0,
            }
        },
        computed: {
            componentList() {
                return this.componentData.filter((i) => i.show && !i.flex).map((i) => i.components);
            },
            flexList() {
                return this.componentData.filter((i) => i.show && i.flex).map((i) => i.components);
            },
        },
        methods: {
            handleCurrentType(data) {
                this.currentType = data + 1;
            }
        },
    });
}
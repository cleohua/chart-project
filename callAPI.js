var user_id;
var sys_code;
var userName;
var isProject;

export function setArgs(args) {
    user_id = args.user_id;
    sys_code = args.sys_code;
    userName = args.userName;
    isProject = args.isProject
};

//月進度表
export async function getProgressMonthData(info, project = null) {
    var sendObj = {
        api: "Engineering/getScheduleReportData",
        data: {
            sys_code_id: !project ? sys_code : project,
            ...info
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//日進度表
export async function getProgressDayData(info, project = null) {
    var sendObj = {
        api: "Engineering/getOverallProgress",
        data: {
            sys_code_id: isProject ? sys_code : project,
            ...info
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//取得工期資訊
export async function getProgressInfoData(project = null) {
    var sendObj = {
        api: "Engineering/getScheduleReportInfo",
        data: {
            sys_code_id: !project ? sys_code : project,
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//取得Money資料
export async function getMoneyData(project = null) {
    var sendObj = {
        api: "Project/GETProject_Content",
        data: {
            projectID: !project ? sys_code : project
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//取得Milestone資料
export async function getMilestoneData(year, project = null) {
    var sendObj = {
        api: "Engineering/getMilestone",
        data: {
            sys_code_id: !project ? sys_code : project,
            year: year,
            type: 3
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//工作議題
export async function getIssuesData(project = null) {
    var sendObj = {
        api: "Review/getFormList",
        data: {
            sys_code_id: !project ? sys_code : project,
            user_id: userLoginInfo.userID
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//查核督導
export async function getSupervisionData(project = null) {
    var sendObj = {
        api: "Supervision/GetSupervisionList",
        data: {
            sys_code_id: !project ? sys_code : project,
            user_id: userLoginInfo.userID
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//工地材料
export async function getMaterialChartData(info, project = null) {
    var sendObj = {
        api: "Material/getMaterialChartData",
        data: {
            sys_code_id: !project ? sys_code : project,
            ...info
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//機具
export async function getMachineChartData(info, project = null) {
    var sendObj = {
        api: "Material/getMachineChartData",
        data: {
            sys_code_id: !project ? sys_code : project,
            ...info
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

// 取得出工統計資料
export async function getPersonCalculationData(info, project = null) {
    var sendObj = {
        api: "SuSupply/getWorkRecordList",
        data: {
            sys_code_id: !project ? sys_code : project,
            ...info
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

// 月進度圖表匯出
export function downloadSCurveReport(project = null) {
    var sendObj = {
        api: "Engineering/getOverallProgressReprot",
        data: {
            sys_code_id: isProject ? sys_code : project,
        },
        threeModal: true
    };

    var option = {
        url: wrsUrl,
        type: "GET",
        data: sendObj,
        dataType: "JSON",
        beforeSend: function () {
            $.blockUI();
        },
        success: function (rs) {
            if (rs.status) {
                downloadFile(rs.data, "工程月進度圖表.xlsx");
            } else {
                msgDialog("匯出失敗");
            }
        },
        error: function () {
            msgDialog("伺服器無回應，請稍後再嘗試");
        },
        complete: function () {
            $.unblockUI();
        }
    };
    $.ajax(option);
}

/**
 * 取得系統 S-Curve 預設資料類型
 */
export async function getDefaultDataType(project = null) {
    let sendObj = {
        api: 'Engineering/getDefaultDataType',
        data: {
            sys_code_id: !project ? sys_code : project,
        },
    }
    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : null;
}

// 設定系統 S-Curve 預設資料類型
export async function setDefaultDataType(type, project = null) {
    let sendObj = {
        api: 'Engineering/setDefaultDataType',
        data: {
            sys_code_id: !project ? sys_code : project,
            type
        },
    }
    let rsData = await fetchPost(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//累計至本週工項
export async function getProcessData(project = null) {
    var sendObj = {
        api: "Engineering/getEngFlow",
        data: {
            sys_code_id: !project ? sys_code : project,
            user_id: userLoginInfo.userID,
        },
        threeModal: true
    };

    let rsData = await fetchGet(sendObj);
    return rsData?.status && rsData?.data ? rsData.data : false;
}

//點工紀錄
// export async function getDayWorkRecordList(info, project = null) {
//     let sendObj = {
//         api: "SuSupply/getDayWorkRecordList",
//         data: {
//             sys_code_id: !project ? sys_code : project,
//             ...info
//         },
//     }; 
//     let rsData = await fetchGet(sendObj);
//     return rsData?.status && rsData?.data ? rsData.data : false;
// }

//點工紀錄假資料
export async function getDayWorkReason() {
    return[
        {
            company:'興富發',
            timeWorkReason:'合約內自辦工程',
            id: '1',
            type: '打石工',
            date: '2023-07-10',
            count: 10,
            hours: '4',
            responsibility: '豐譽營造股份有限公司(本公司)',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        },
        {
            company:'興富發',
            timeWorkReason:'工程缺失改善、計畫不周全',
            id: '2',
            type: '打石工',
            date: '2023-07-10',
            count: 15,
            hours: '4',
            responsibility: '正中鋼材公司',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        },
        {
            company:'興富發',
            timeWorkReason:'雜項(環境清理、勞安及氣候等)配合工作',
            id: '3',
            type: '打石工',
            date: '2023-07-10',
            count: 22,
            hours: '4',
            responsibility: '富國(鋼筋)',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        },
        {
            company:'興富發',
            timeWorkReason:'業主追加',
            id: '4',
            type: '打石工',
            date: '2023-07-10',
            count: 12,
            hours: '4',
            responsibility: '公司01',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        },
        {
            company:'興富發',
            timeWorkReason:'廠商分攤',
            id: '5',
            type: '打石工',
            date: '2023-07-10',
            count: 15,
            hours: '4',
            responsibility: '公司02',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        },
        {
            company:'興富發',
            timeWorkReason:'其它',
            id: '6',
            type: '打石工',
            date: '2023-07-10',
            count: 9,
            hours: '4',
            responsibility: '公司03',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        },
    ];
}

//取得點工統計
export async function getDayWorkRecordList() {
    return [
        {
            company:'興富發',
            id: '1',
            date: '2023-07-10',
            type: '打石工',
            count: '1.5',
            hours: '4',
            responsibility: '豐譽營造股份有限公司(本公司)',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        }, 
        {
            company:'興富發',
            id: '2',
            date: '2023-07-11',
            type: '粗工',
            count: '5',
            hours: '10',
            responsibility: '正中鋼材公司',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        },
        {
            company:'興富發',
            id: '3',
            date: '2023-07-10',
            type: '清潔工',
            count: '3',
            hours: '4',
            responsibility: '富國(鋼筋)',
            reason: '1212121221sdfs',
            pic: '',
            limitPerson: 60,
        }, 

    ]
}
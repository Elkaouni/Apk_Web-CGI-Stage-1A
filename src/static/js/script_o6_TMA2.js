var listTMAHTML = document.getElementById('listTMA').innerText;
var Applications_venduesHTML = document.getElementById('Applications_vendues').innerText;
var ticket_countHTML = document.getElementById("ticket_count").innerText;

var ListTMA = JSON.parse(listTMAHTML);   //listPersonneParApkMois
var ListApplication = JSON.parse(Applications_venduesHTML);
var tickets = JSON.parse(ticket_countHTML);

let last_month = ListTMA[ListTMA.length-1].MONTH;


//month filter
let monthsList = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet',
    'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

let monthLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
    'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

let monthfilter_table = document.getElementById("monthfilter_table");
var mois = 0;
let nb_col = last_month + 2;
let row = monthfilter_table.insertRow(0);
for (var j = 0; j < nb_col; j++) {
    let cell = row.insertCell(j);
    if (j === 0) {
        cell.innerHTML = " <label for='uncheck_all_months'> "
            + " <input id='uncheck_all_months' name='uncheck_all_months' onclick='reset_month_filter()'"
            + " type='button' value='Uncheck All'>"
            + " </label> ";
    } else if (j === 1) {
        cell.innerHTML = " <label for='check_all'>"
            + " <input id='check_all_months' name='check_all_months' onclick='checkAllMonths()'"
            + " type='button' value='Check All'> "
            + " </label> ";
    } else {
        try {

            cell.innerHTML = "<label for='" + monthsList[mois] + "'> " +
                "            <input id='" + monthsList[mois] + "' class='mois' onchange='setFilter()'" +
                " name='" + monthsList[mois] + "'  type='checkbox' value='" + (mois + 1) + "' " +
                "data-idx='" + (mois + 1) + "' checked >" + monthLabels[mois] +
                "  </label> &nbsp;&nbsp;";
            mois++;
            if (mois === last_month) break;
        } catch (err) {
            console.log(err);
        }
    }
}

let filterList_mois = []; // 1 if apk filter fo apk_i up, else 0
for(var i=0; i<last_month; i++){
    filterList_mois.push(1);
}

/////////////////////////////////////////////////////////////////////////

//sort data per apk
let aList = [];
for (var i = 0; i < ListApplication.length; i++) {
    aList.push([ListApplication[i].APPLICATION_NAME, [] , []]); //apk + done/undone tickets
}
//first sort SERVICES  per APK
for (var a = 0; a < ListApplication.length; a++) {
    for (var i = 0; i < ListTMA.length; i++) {
        if(a!== ListApplication.length) {
            if (ListTMA[i].APPLICATION_NAME === ListApplication[a].APPLICATION_NAME) {
                if (ListTMA[i].RESOLUTION_PROGRESS === "CLOSED SKIPPED"
                    || ListTMA[i].RESOLUTION_PROGRESS === "CLOSED"
                    || ListTMA[i].RESOLUTION_PROGRESS === "RESOLVED"
                    || ListTMA[i].RESOLUTION_PROGRESS === "CLOSED COMPLETE"
                    || ListTMA[i].RESOLUTION_PROGRESS === "RÉSOLU"
                    || ListTMA[i].RESOLUTION_PROGRESS === "DEPLOYED TO PRODUCTION"
                    || ListTMA[i].RESOLUTION_PROGRESS === "SUBMITTED FOR ACCEPTANCE"
                    || ListTMA[i].RESOLUTION_PROGRESS === "SUBMITTED FOR ACCEPTANCE"
                    || ListTMA[i].RESOLUTION_PROGRESS === "FERMÉ"
                    || ListTMA[i].RESOLUTION_PROGRESS === null
                    || ListTMA[i].RESOLUTION_PROGRESS === "ACKNOWLEDGMENT") {
                    aList[a][1].push(ListTMA[i]);

                } else {
                    aList[a][2].push(ListTMA[i]);
                }
            }
        }
        else{
            if (ListTMA[i].APPLICATION_NAME === null) {
                if (ListTMA[i].RESOLUTION_PROGRESS === "CLOSED SKIPPED"
                    || ListTMA[i].RESOLUTION_PROGRESS === "CLOSED"
                    || ListTMA[i].RESOLUTION_PROGRESS === "RESOLVED"
                    || ListTMA[i].RESOLUTION_PROGRESS === "CLOSED COMPLETE"
                    || ListTMA[i].RESOLUTION_PROGRESS === "RÉSOLU"
                    || ListTMA[i].RESOLUTION_PROGRESS === "DEPLOYED TO PRODUCTION"
                    || ListTMA[i].RESOLUTION_PROGRESS === "SUBMITTED FOR ACCEPTANCE"
                    || ListTMA[i].RESOLUTION_PROGRESS === "SUBMITTED FOR ACCEPTANCE"
                    || ListTMA[i].RESOLUTION_PROGRESS === "FERMÉ"
                    || ListTMA[i].RESOLUTION_PROGRESS === null
                    || ListTMA[i].RESOLUTION_PROGRESS === "ACKNOWLEDGMENT") {
                    aList[a][1].push(ListTMA[i]);

                } else {
                    aList[a][2].push(ListTMA[i]);
                }
            }
        }
    }
}


/////////////////////////////////////////////////////////////////////////


let list_imp = [[],[]];  // [ Mx:[janv,....dec] * nb serv ] * apk  0=résolu , 1= encours
var list_effort_estimated=[[],[]];
for (var apk = 0; apk < aList.length; apk++) {
    list_imp[0].push([]); //imp months for each serv
    list_imp[1].push([]);
    list_effort_estimated[0].push([]); //imp months for each serv
    list_effort_estimated[1].push([]);
    for (var i = 0; i < 5; i++){
        list_imp[0][apk].push([]); //imp months for each serv
        list_imp[1][apk].push([]);
        list_effort_estimated[0][apk].push([]); //imp months for each serv
        list_effort_estimated[1][apk].push([]);
        for (var m = 0; m < last_month; m++) { //last case pour items with Apk_name null
            list_effort_estimated[0][apk][i].push(0); //imp for each apk in eac serv
            list_effort_estimated[1][apk][i].push(0);

            list_imp[0][apk][i].push([[],0]); //0: tickets, 1: imp des apk
            list_imp[1][apk][i].push([[],0]); //0: tickets, 1: imp des apk
        }
    }
}

let serviceList=["M6","M7","M10","M11","M3","M4"]
for(var ticket =1; ticket < 3; ticket++) {
    for (var a = 0; a < aList.length; a++) {
        for (var serv = 0; serv < serviceList.length; serv++) {
            for (var mois = 0; mois < last_month; mois++) {

                for (var item = 0; item < aList[a][ticket].length; item++) {
                   if (aList[a][ticket][item].MONTH === mois+1
                        && aList[a][ticket][item].SELECT_LIST_1 === serviceList[serv] ) {

                        var imp = aList[a][ticket][item].HOURS;
                        var ss= serv;
                        if( serviceList[serv] === "M4"){
                            ss = serv-1;
                        }
                        list_imp[ticket-1][a][ss][mois][1] += imp;

                        if(aList[a][ticket][item].EXTERNAL_TICKET_ID !== null){
                            list_effort_estimated[ticket-1][a][ss][mois] += aList[a][ticket][item].ESTIMATED_EFFORT;
                        }
                    }
                }
            }
        }
    }
}
for(var ticket =0; ticket < 2; ticket++) {
    for (var a = 0; a < aList.length; a++) {
        for (var serv = 0; serv < serviceList.length; serv++) {
            for (var mois = 0; mois < last_month; mois++) {

                for (var item = 0; item < tickets.length; item++) {
                    if(tickets[item].APPLICATION_NAME === aList[a][0]
                        && tickets[item].SERVICE === serviceList[serv]
                        && tickets[item].MONTH === mois +1){
                        var ss=serv;
                        if(serv === 5) ss = serv -1;
                        list_imp[ticket][a][ss][mois][0].push([tickets[item].APPLICATION_NAME, tickets[item].ISSUE]);
                    }
                }
            }
        }
    }
}


let sum_filter=[[],[]]; //somme des imputations pour chaque serv
let sum_estimated=[[],[]];
for(var i =0; i<aList.length; i++ ){
    sum_filter[0].push([0,0,0,0,0]);
    sum_filter[1].push([0,0,0,0,0]);
    sum_estimated[0].push([0,0,0,0,0]);
    sum_estimated[1].push([0,0,0,0,0]);
}

function calc_values(){
    for(var t =0; t<2; t++){
        for(var a =0; a<aList.length ; a++){
            for(var serv = 0; serv<serviceList.length-1; serv++){
                var tot=0, ss=0;
                for(var mois = 0; mois<last_month; mois++){
                    tot += list_imp[t][a][serv][mois][1] * filterList_mois[mois] ;
                    ss += list_effort_estimated[t][a][serv][mois] * filterList_mois[mois] ;
                }
                sum_filter[t][a][serv] = tot/8;
                sum_estimated[t][a][serv] = ss/8;
            }
        }
    }
}
calc_values();

const thead = document.getElementById("thead_tma");
const tbody = document.getElementById("tbody_tma");

 /////// draw table and insert in table
function draw_head() {
    let head = thead.insertRow(0)
    head.insertCell(0);
    let cell = head.insertCell(1);
    cell.colSpan = "5";
    cell.innerText = "Tickets Résolus (H)";

    cell = head.insertCell(2);
    cell.colSpan = "5";
    cell.innerText = "Tickets E cours (H)";

    head = thead.insertRow(1)
    head.insertCell(0);

    function insert_sous_services(j) {
        cell = head.insertCell(j + 1);
        cell.innerText = "M6";
        cell = head.insertCell(j + 2);
        cell.innerText = "M7";
        cell = head.insertCell(j + 3);
        cell.innerText = "M10";
        cell = head.insertCell(j + 4);
        cell.innerText = "M11";
        cell = head.insertCell(j + 5);
        cell.innerText = "M3/M4";
    }

    insert_sous_services(0);
    insert_sous_services(5);

    head = thead.insertRow(2)
    cell = head.insertCell(0);
    cell.innerText = "Objectif";
    for (var i = 0; i < 10; i++) {
        cell = head.insertCell(i + 1);
        cell.innerText = 0;
        cell.style.backgroundColor = "#ffd2d2";
        cell.style.color = "#000000";
    }
}
draw_head()

//insert head obj of table
function insert_obj(columns) {
    let head = thead.rows[2]
    for (let m = 0; m < 5; m++) {
        let objectif = head.cells[5*columns +m + 1];
        let obj_total = 0;

        switch (m) {
            case 0: //M6
                    obj_total = 1.71;
                break;
            case 1: //M7
                obj_total = 0.32;
                break;
            case 2: //M10
                obj_total = 0.54;
                break;
            case 3: //M11
                obj_total = 0.09;
                break;
            case 4: //M3
                obj_total = 20 + "%";
                break;
        }
        if(obj_total !== "20%") obj_total = obj_total.toFixed(2);
        objectif.innerHTML = obj_total ;
    }
}
insert_obj(0);
insert_obj(1);

let objectif_row = thead.rows[2];
for(var i=0; i< aList.length ; i++) {
    let row = tbody.insertRow(i);
    let apk = row.insertCell(0);
    if(aList[i][0] === null){
        apk.innerText = "Null";
    }
    else{
        apk.innerText = aList[i][0];
    }
    for (var t = 0; t < 2; t++) {
        for (var j = 0; j < 5; j++) {
            let cell = row.insertCell(5 * t + j + 1);
            let text = 0;
            let objectif = objectif_row.cells[5 * t + j + 1].innerText;

            text = sum_filter[t][i][j];
            var filter_on=0;
            for(var k=0; k< filterList_mois.length; k++){
                filter_on += filterList_mois[k];
            }

            if( j < 4) {
                if(filter_on >=1){
                    var nb_ticket = 0;
                    var list_issues = [];
                    for(var k=0; k< filterList_mois.length; k++){
                        if(filterList_mois[k]===1) {
                            for(var l = 0; l<list_imp[t][i][j][k][0].length; l++) {
                                if (list_issues.includes(list_imp[t][i][j][k][0][l]) === false) {
                                        list_issues.push(list_imp[t][i][j][k][0][l][1]);
                                }
                            }
                        }
                    }
                    nb_ticket =  list_issues.length;
                    if(nb_ticket !== 0) text = text / nb_ticket;
                    else text = 0 ;
                }
            }
            else {   // M3/M4
                if (sum_estimated[t][i][j] !== 0)
                    text = ((sum_estimated[t][i][j] - text) / sum_estimated[t][i][j]) * 100;
                else
                    text = "NA";
            }

            if (text === "NA")
                cell.innerText = text;
            else{
                cell.innerText = text.toFixed(2);
                if (j === 4) {
                    cell.innerText += " %";
                    if(text>0)
                        cell.style.background = "#b3ffb0"
                    else
                        cell.style.background = "#ffb0b0"
                }
                else {
                    if (text > 1.3* parseFloat(objectif) ) {
                        cell.style.background = "#ffb0b0"
                    } else if (1.3 * parseFloat(objectif)>text && text>parseFloat(objectif)) {
                        cell.style.background = "rgba(255,193,142,0.93)"
                    } else if (text <= parseFloat(objectif)) {
                        cell.style.background = "#b3ffb0"
                    }

                    if (text === 0) {
                        cell.style.background = "#c2c2c2"
                    }
                }
            }
        }
    }  
}



//Bar chart
let colors2 = [
    "#04108d", "#ff0044", "#1da06f", "#9b8ffb",
    "#b2b6c5", "#ec92b1", "#7af0ff", "#68ff99",
    "#326049", "#7bd49e", "#c1ffde", "#9ac0a6",
    "#698f39", "#cdd375", "#cacca4", "#5c5b38",
    "#b56e05", "#f39828", "#dea26e", "#fbe1b2",
    "#4e8b55", "#094f71", "#77aa02", "#d45b6d",
];

let old_charts = [];
function drawChart() {

    let canvas = document.getElementById("canvas");
    let nbColumn = 3;
    let nbRows = Math.trunc(ListApplication.length / nbColumn) + 1;

    var values = sum_filter;
    for(var i=0; i< aList.length; i++){
        for(var t=0; t< 2; t++){
            for(var j=0; j< 5; j++) {
                values[t][i][j] = sum_filter[t][i][j]; 
                var nb_ticket = 0;
                var list_issues = [];
                for (var k = 0; k < filterList_mois.length; k++) {
                    if (filterList_mois[k] === 1) {
                        for (var l = 0; l < list_imp[0][i][j][k][0].length; l++) {
                            if (list_issues.includes(list_imp[t][i][j][k][0][l]) === false) {
                                list_issues.push(list_imp[t][i][j][k][0][l][1]);
                            }
                        }
                    }
                }
                nb_ticket =  list_issues.length;
                if(nb_ticket !== 0) values[t][i][j] = values[t][i][j] / nb_ticket;
                else values[t][i][j] = 0 ;
            }
        }
    }
    

    let adata_resolved = [], adata_pending = [];
    for (var i = 0; i < ListApplication.length; i++) {
        adata_resolved.push(values[0][i]);
        adata_pending.push(values[1][i]);
    }

    let objectifs = [1.71,	0.32,	0.54,	0.09,	0.2];
    let obj_total = {
        type: 'line',
        label: 'Objectif',
        data: objectifs,
        borderColor: "#ff0000",
        order: 0,
        borderDash: [10, 5],
        borderWidth: 2,
        backgroundColor: "rgba(255,255,255,0)",
    };

    const labels = ["M6", "M7", "M10", "M11", "M3/M4"];
    let num_id = 0;
    var i = 0;
    while (i < nbRows) {
        let row = canvas.insertRow(i);
        for (var j = 0; j < nbColumn; j++) {
            let cell = row.insertCell(j);
            let id = 'myChart' + num_id;
            let set_ij_resolved = {
                type: 'bar',
                label: "Résolue",
                data: adata_resolved[num_id],
                borderColor: "blue",
                backgroundColor: "blue",
                order: 1
            };
            let set_ij_pending = {
                type: 'bar',
                label: "En cours",
                data: adata_pending[num_id],
                borderColor: colors2[1],
                backgroundColor: colors2[1],
                order: 1
            };

            var dataset_ij = [set_ij_resolved, set_ij_pending, obj_total];
            const data_ij = {
                labels: labels,
                datasets: dataset_ij
            };

            cell.innerHTML = " <canvas id= '" + id + "' style= 'width:100%; max-width:410px; margin: 8px'> </canvas>";
            const config_ij = {
                type: 'bar',
                data: data_ij,
                options: {
                    title: {
                        display: true,
                        text: 'Application: ' + ListApplication[num_id].APPLICATION_NAME,
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                fontSize: 20,
                            }
                        },
                        title: {
                            display: true,
                            text: 'Graphe ' + num_id
                        }
                    },
                },
            };
            num_id++;
            var chart = new Chart(id, config_ij);

            old_charts.push(chart);
            if (num_id === ListApplication.length) break;
        }
        if (num_id === ListApplication.length) break;
        i++;
    }
}
drawChart();



////////// set filter

function update_table() {
    insert_obj(0);
    insert_obj(1);
    let objectif_row = thead.rows[2];
    for(var i=0; i< aList.length ; i++) {
        let row = tbody.rows[i];
        for (var t = 0; t < 2; t++) {
            for (var j = 0; j < 5; j++) {
                let cell = row.cells[5 * t + j + 1];
                let text = 0;
                let objectif = objectif_row.cells[5 * t + j + 1].innerText;

                text = sum_filter[t][i][j];

                if( j < 4) {
                    if(filter_on >=1){
                        var nb_ticket = 0;
                        var list_issues = [];
                        for(var k=0; k< filterList_mois.length; k++){
                            if(filterList_mois[k]===1) {
                                for(var l = 0; l<list_imp[t][i][j][k][0].length; l++) {
                                    if (list_issues.includes(list_imp[t][i][j][k][0][l]) === false) {
                                        list_issues.push(list_imp[t][i][j][k][0][l][1]);
                                    }
                                }
                            }
                        }
                        nb_ticket =  list_issues.length;
                        if(nb_ticket !== 0) text = text / nb_ticket;
                        else text = 0 ;
                    }
                }
                else {   // M3/M4
                    if (sum_estimated[t][i][j] !== 0)
                        text = ((sum_estimated[t][i][j] - text) / sum_estimated[t][i][j]) * 100;
                    else
                        text = "NA";
                }

                if (text === "NA") {
                    cell.innerText = text;
                    cell.style.background = "none" ;
                }
                else{
                    cell.innerText = text.toFixed(2);
                    if (j === 4) {
                        cell.innerText += " %";
                        if(text>0)
                            cell.style.background = "#b3ffb0"
                        else
                            cell.style.background = "#ffb0b0"
                    }
                    else {
                        if (text > 1.3* parseFloat(objectif) ) {
                            cell.style.background = "#ffb0b0"
                        } else if (1.3 * parseFloat(objectif)>text && text>parseFloat(objectif)) {
                            cell.style.background = "rgba(255,193,142,0.93)"
                        } else if (text <= parseFloat(objectif)) {
                            cell.style.background = "#b3ffb0"
                        }

                        if (text === 0) {
                            cell.style.background = "#c2c2c2"
                        }
                    }
                }
            }
        }
    }
}
function update_chart() {
    for (var i = 0; i < old_charts.length; i++) {
        old_charts[i].destroy()
    }
    drawChart();
}
function re_init_filterlist_month() {
    for (var i = 0; i < filterList_mois.length; i++) {
        filterList_mois[i] = 0;
    }
}
function check_all_filterList_mois() {
    for (var i = 0; i < filterList_mois.length; i++) {
        filterList_mois[i] = 1;
    }
}
function setMonthFilter() {
    try {
        for (var m = 0; m < last_month; m++) {
            var id_k = monthsList[m];
            var mois = document.getElementById(id_k);
            if (mois.checked) {
                filterList_mois[m] = 1;
            } else {
                filterList_mois[m] = 0;
            }
        }
    } catch (err) {
        console.log(err);
    }
}
function setFilter() {
    try {
        re_init_filterlist_month();
        setMonthFilter();
        calc_values();
        update_table();
        update_chart();
    } catch (err) {
        console.log(err);
    }
}
function reset_month_filter() {
    for (var a = 0; a < last_month; a++) {
        var id_k = monthsList[a];
        var apk = document.getElementById(id_k);
        apk.checked = false;
    }
    re_init_filterlist_month();
    calc_values();
    update_table();
    update_chart();
    console.log("filter month reset");
}
function checkAllMonths() {
    for (var a = 0; a < last_month; a++) {
        var id_k = monthsList[a];
        var apk = document.getElementById(id_k);
        apk.checked = true;
    }
    check_all_filterList_mois();
    calc_values();
    update_table();
    update_chart();
    console.log("filter all checked");
}


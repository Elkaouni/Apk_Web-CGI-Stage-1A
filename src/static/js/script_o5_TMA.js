var listTMAHTML = document.getElementById('listTMA').innerText;
var listEquipeTMAHTML = document.getElementById('listEquipeTMA').innerText;
var Applications_venduesHTML = document.getElementById('Applications_vendues').innerText;
var ticket_countHTML = document.getElementById("ticket_count").innerText;

var ListTMA,  ListEquipeTMA, ListApplication, tickets;

ListTMA = JSON.parse(listTMAHTML);   //listPersonneParApkMois
ListEquipeTMA = JSON.parse(listEquipeTMAHTML);
ListApplication = JSON.parse(Applications_venduesHTML);
tickets = JSON.parse(ticket_countHTML);

let last_month = ListTMA[ListTMA.length-1].MONTH;
console.log("last_month -->" + last_month)



// FILTERS --->>>
 // month filter
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

//Apk Filter -->
let filter_table = document.getElementById("filter_table");
var i = 0, count = 0;
let nb_columns = 10;
let nb_rows = Math.trunc(ListApplication.length / nb_columns) + 1;
while (i < nb_rows) {
    let row = filter_table.insertRow(i);
    for (var j = 0; j < nb_columns; j++) {
        let cell = row.insertCell(j);
        if (i === 0 && j === 0) {
            cell.innerHTML = " <label for='uncheck_all_services'>" +
                "   <input id='uncheck_all_services' name='uncheck_all_services' onclick='reset_apk_filter()'" +
                "             type='button' value='Uncheck All'>" +
                "</label> &nbsp;&nbsp;";
        } else if (i === 0 && j === 1) {
            cell.innerHTML = " <label for='check_all_apks'>" +
                "   <input id='check_all_apks' name='check_all_apks' onclick='checkAllApks()'" +
                "         type='button' value='Check All'>" +
                "</label> &nbsp;&nbsp;";
        } else {
            try {
                cell.innerHTML = "<label for='app_" + count + "'> " +
                    "            <input id='app_" + count + "' name='" + ListApplication[count].APPLICATION_NAME + "' " +
                    "                checked type='checkbox' value='" + count + "' data-idx='" + count + "'" +
                    "onchange='setFilter()'>" + ListApplication[count].APPLICATION_NAME +
                    "        </label> &nbsp;&nbsp;";
                count++;
                if (count === ListApplication.length) break;
            } catch (err) {
                console.log(err);
            }
        }
    }
    if (count === ListApplication.length) break;
    i++;
}

//filters' lists
let filterList_mois = []; // 1 if apk filter fo apk_i up, else 0
for(var i=0; i<last_month; i++){
    filterList_mois.push(1);
}
let filterList_apk = []; // 1 if service M filter fo apk_i up, else 0
for(var i=0; i < ListApplication.length+1 ; i++){
    filterList_apk.push(1);
}


// sort data per person
let pList = [];
for (var p = 0; p < ListEquipeTMA.length; p++) {
    pList.push([ListEquipeTMA[p].WORK_LOGGED_BY, [] , []]); //person + done/undone tickets
    for (var i = 0; i < ListTMA.length; i++) {
        if (ListTMA[i].WORK_LOGGED_BY === ListEquipeTMA[p].WORK_LOGGED_BY) {
            if(ListTMA[i].RESOLUTION_PROGRESS === "CLOSED SKIPPED"
            || ListTMA[i].RESOLUTION_PROGRESS === "CLOSED"
            || ListTMA[i].RESOLUTION_PROGRESS ==="RESOLVED"
            || ListTMA[i].RESOLUTION_PROGRESS ==="CLOSED COMPLETE"
            || ListTMA[i].RESOLUTION_PROGRESS ==="RÉSOLU"
            || ListTMA[i].RESOLUTION_PROGRESS ==="DEPLOYED TO PRODUCTION"
            || ListTMA[i].RESOLUTION_PROGRESS ==="SUBMITTED FOR ACCEPTANCE"
            || ListTMA[i].RESOLUTION_PROGRESS === "SUBMITTED FOR ACCEPTANCE"
            || ListTMA[i].RESOLUTION_PROGRESS === "FERMÉ"
            || ListTMA[i].RESOLUTION_PROGRESS ===null
            || ListTMA[i].RESOLUTION_PROGRESS === "ACKNOWLEDGMENT")
            {
                pList[p][1].push(ListTMA[i]);
            }
            else {
                pList[p][2].push(ListTMA[i]);
            }
        }
    }
}
 

/////////

let list_imp = [[],[]];  // [ Mx:[a1,....an] * nb serv ] * pers  0=résolu , 1= encours
var list_effort_estimated=[[],[]];
for (var p = 0; p < ListEquipeTMA.length; p++) {
    list_imp[0].push([]); //imp months for each serv
    list_imp[1].push([]);
    list_effort_estimated[0].push([]);
    list_effort_estimated[1].push([]);
    for (var serv = 0; serv < 5; serv++) {
        list_imp[0][p].push([]); //imp months for each serv
        list_imp[1][p].push([]);
        list_effort_estimated[0][p].push([]);
        list_effort_estimated[1][p].push([]);
        for (var mois = 0; mois < last_month; mois++) {
            list_imp[0][p][serv].push([]);
            list_imp[1][p][serv].push([]);
            list_effort_estimated[0][p][serv].push([]);
            list_effort_estimated[1][p][serv].push([]);

            list_imp[0][p][serv][mois] = [[],[]]; //0: tickets, 1: imp des apk
            list_imp[1][p][serv][mois] = [[],[]]; //0: tickets, 1: imp des apk
            for (var a = 0; a < ListApplication.length + 1; a++) { //last case pour items with Apk_name null
                list_imp[0][p][serv][mois][1].push(0); //imp for each apk in eac serv
                list_imp[1][p][serv][mois][1].push(0);
                list_effort_estimated[0][p][serv][mois].push(0); //imp for each apk in eac serv
                list_effort_estimated[1][p][serv][mois].push(0);
            }
        }
    }
}

var list_nullApk=[];
let serviceList=["M6","M7","M10","M11","M3","M4"]
for(var ticket =1; ticket < 3; ticket++) {
    for (var p = 0; p < ListEquipeTMA.length; p++) {
        for (var serv = 0; serv < serviceList.length; serv++) {
            for (var mois = 0; mois < last_month; mois++) {
                for (var apk = 0; apk < ListApplication.length; apk++) {
                    for (var item = 0; item < pList[p][ticket].length; item++) {
                        var str = ListApplication[apk].APPLICATION_NAME;
                        var str2 = pList[p][ticket][item].APPLICATION_NAME;
                        if(str2 ===null) {
                            if(!(list_nullApk.includes(pList[p][ticket][item])))
                                list_nullApk.push(pList[p][ticket][item]);
                        }
                        else if (str2 === str
                            && pList[p][ticket][item].MONTH === mois+1
                                && pList[p][ticket][item].SELECT_LIST_1 === serviceList[serv] ) {

                            var imp = pList[p][ticket][item].HOURS;
                            var ss= serv;
                            if( serviceList[serv] === "M4"){
                                ss = serv-1;
                            }
                            list_imp[ticket-1][p][ss][mois][1][apk] += imp;

                            if(pList[p][ticket][item].EXTERNAL_TICKET_ID !== null){
                                list_effort_estimated[ticket-1][p][ss][mois][apk] += pList[p][ticket][item].ESTIMATED_EFFORT;
                            }
                        }
                    }
                }
            }
        }
    }
}
//for items with null apk_name:
for(var ticket =1; ticket < 3; ticket++) {
    for (var p = 0; p < ListEquipeTMA.length; p++) {
        for (var mois = 0; mois < last_month; mois++) {
            var serv = 0;
            for (var apk = 0; apk < ListApplication.length; apk++) {
                for (var item = 0; item < list_nullApk.length; item++) {
                    if (list_nullApk[item].WORK_LOGGED_BY === ListEquipeTMA[p].WORK_LOGGED_BY
                        && mois+1 === parseInt(list_nullApk[item].MONTH)) {
                        var service = list_nullApk[item].SELECT_LIST_1;
                        switch (service) {
                            case'M6':
                                serv = 0;
                                break;
                            case'M7':
                                serv = 1;
                                break;
                            case'M10':
                                serv = 2;
                                break;
                            case'M11':
                                serv = 3;
                                break;
                            case'M3':
                            case'M4':
                                serv = 4;
                                break;

                        }
                        var imp = parseFloat(list_nullApk[item].HOURS);
                        list_imp[ticket-1][p][serv][mois][1][ListApplication.length] += imp;
                    }
                }
            }
        }
    }
}

for(var ticket =0; ticket < 2; ticket++) {
    for (var p = 0; p < ListEquipeTMA.length; p++) {
        for (var serv = 0; serv < serviceList.length; serv++) {
            for (var mois = 0; mois < last_month; mois++) {
                for (var item = 0; item < tickets.length; item++) {
                    if(tickets[item].WORK_LOGGED_BY === ListEquipeTMA[p].WORK_LOGGED_BY
                    && tickets[item].SERVICE === serviceList[serv]
                    && tickets[item].MONTH === mois +1){
                        var ss=serv;
                        if(serv === 5) ss = serv -1;
                        list_imp[ticket][p][ss][mois][0].push([tickets[item].APPLICATION_NAME, tickets[item].ISSUE]);
                    }
                }
            }
        }
    }
}

let sum_filter=[[],[]]; //somme des imputations pour chaque serv
let sum_estimated=[[],[]];
for(var i =0; i<pList.length; i++ ){
    sum_filter[0].push([0,0,0,0,0,0]);
    sum_filter[1].push([0,0,0,0,0,0]);
    sum_estimated[0].push([0,0,0,0,0,0]);
    sum_estimated[1].push([0,0,0,0,0,0]);
}

console.log("before calc values");

function calc_values(){
    for(var t =0; t<2; t++){
        for(var p =0; p<pList.length ; p++){
            for(var serv = 0; serv<serviceList.length-1; serv++){
                var tot=0, ss=0;
                for(var mois = 0; mois<last_month; mois++){
                    for (var apk = 0; apk < ListApplication.length+1; apk++) {
                        tot += list_imp[t][p][serv][mois][1][apk] * filterList_apk[apk] * filterList_mois[mois] ;
                        ss += list_effort_estimated[t][p][serv][mois][apk]* filterList_apk[apk] * filterList_mois[mois] ;
                    }
                }
                sum_filter[t][p][serv] = tot/8;
                sum_estimated[t][p][serv] = ss/8;
            }
        }
    }
}
calc_values();


 /////// draw table and insert in table
const thead = document.getElementById("thead_tma");
const tbody = document.getElementById("tbody_tma");

function draw_head() {
    let head = thead.insertRow(0)
    head.insertCell(0);
    let cell = head.insertCell(1);
    cell.colSpan = "5";
    cell.innerText = "Tickets Résolus (J)";

    cell = head.insertCell(2);
    cell.colSpan = "5";
    cell.innerText = "Tickets E cours (J)";

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
        let filter_mois_on = 0, filter_apk_on = 0;
        for (var a = 0; a < last_month; a++) {
            filter_mois_on += filterList_mois[a];
        }

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

for(var i=0; i< ListEquipeTMA.length ; i++) {
    let objectif_row = thead.rows[2];
    let row = tbody.insertRow(i);
    let staff = row.insertCell(0);
    staff.innerText = ListEquipeTMA[i].WORK_LOGGED_BY;
    for (var t = 0; t < 2; t++) {
        for (var j = 0; j < 5; j++) {    //ticket résolu
            let cell = row.insertCell(5 * t + j + 1);
            let text = 0;
            let objectif = objectif_row.cells[5 * t + j + 1].innerText;

            var filter_on=0;
            for(var k=0; k< filterList_mois.length; k++){
                filter_on += filterList_mois[k];
            }
            text = sum_filter[t][i][j];

            if( j < 4) {
                if(filter_on === 1){
                    // i person, t ticket, j serv
                    var chosen_month = filterList_mois.indexOf(1);
                    var nb_ticket = list_imp[t][i][j][chosen_month][0].length;
                    if(nb_ticket !== 0) text = text / nb_ticket;
                    else text = 0;
                }
                else if(filter_on >1){
                    var nb_ticket = 0;
                    var list_issues = [];
                    for(var k=0; k< filterList_mois.length; k++){
                        if(filterList_mois[k]===1) {
                            for(var l = 0; l<list_imp[t][i][j][k][0].length; l++) {
                                if (list_issues.includes(list_imp[t][i][j][k][0][l]) === false) {
                                    for (var aa = 0; aa < filterList_apk.length; aa++) {
                                        if (filterList_apk[aa] === 1){
                                            if(aa === ListApplication.length){
                                                if(list_imp[t][i][j][k][0][l][0] === null){
                                                    list_issues.push(list_imp[t][i][j][k][0][l][1]);
                                                }
                                            }
                                            else{
                                                if(list_imp[t][i][j][k][0][l][0] === ListApplication[aa].APPLICATION_NAME){
                                                    list_issues.push(list_imp[t][i][j][k][0][l][1]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    nb_ticket =  list_issues.length;
                    if(nb_ticket !== 0) text = text / nb_ticket;
                    else text = 0;
                }
            }
            else {   // M3/M4
                if(sum_estimated[t][i][j] !== 0)
                    text =(( sum_estimated[t][i][j] - text ) / sum_estimated[t][i][j]) *100;
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


////////// set filter

function update_table() {
    insert_obj(0);
    insert_obj(1);
    let objectif_row = thead.rows[2];
    for(var i=0; i< ListEquipeTMA.length ; i++) {
        let row = tbody.rows[i];
        let staff = row.cells[0];
        staff.innerText = ListEquipeTMA[i].WORK_LOGGED_BY;
        for (var t = 0; t < 2; t++) {
            for (var j = 0; j < 5; j++) {    //ticket
                let objectif = objectif_row.cells[5*t +j+1].innerText;
                let cell = row.cells[5*t + j+1];
                let text = 0;

                var filter_on=0;
                for(var k=0; k< filterList_mois.length; k++){
                    filter_on += filterList_mois[k];
                }
                text = sum_filter[t][i][j];
                
                if( j < 4) {
                    if(filter_on >=1){
                        var nb_ticket = 0;
                        var list_issues = [];
                        for(var k=0; k< filterList_mois.length; k++){
                            if(filterList_mois[k]===1) {
                                for(var l = 0; l<list_imp[t][i][j][k][0].length; l++) {
                                    if (list_issues.includes(list_imp[t][i][j][k][0][l]) === false) {
                                        for (var aa = 0; aa < filterList_apk.length; aa++) {
                                            if (filterList_apk[aa] === 1){
                                                if(aa === ListApplication.length){
                                                    if(list_imp[t][i][j][k][0][l][0] === null){
                                                        list_issues.push(list_imp[t][i][j][k][0][l][1]);
                                                    }
                                                }
                                                else{
                                                    if(list_imp[t][i][j][k][0][l][0] === ListApplication[aa].APPLICATION_NAME){
                                                        list_issues.push(list_imp[t][i][j][k][0][l][1]);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        nb_ticket =  list_issues.length;
                        if(nb_ticket !== 0) text = text / nb_ticket;
                        else text = 0;
                    }
                }
                else {   // M3/M4
                    if(sum_estimated[t][i][j] !== 0)
                        text =(( sum_estimated[t][i][j] - text ) / sum_estimated[t][i][j]) *100;
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


function re_init_filterlist_apk() {
    for (var i = 0; i < ListApplication.length+1; i++) {
        filterList_apk[i] = 0;
    }
}
function re_init_filterlist_month() {
    for (var i = 0; i < filterList_mois.length; i++) {
        filterList_mois[i] = 0;
    }
}
function check_all_filterList_apk() {
    for (var i = 0; i < ListApplication.length; i++) {
        filterList_apk[i] = 1;
    }
    console.log("check_all_filterList_apk -->" + filterList_apk);
}
function check_all_filterList_mois() {
    for (var i = 0; i < filterList_mois.length; i++) {
        filterList_mois[i] = 1;
    }    console.log("filterList_service -->" + filterList_mois);
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
function setApkFilter() {
    try {
        for (var a = 0; a < ListApplication.length; a++) {
            var id_k = 'app_' + a;
            var apk = document.getElementById(id_k);
            if (apk.checked) {
                filterList_apk[a] = 1;
            } else {
                filterList_apk[a] = 0;
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function setFilter() {
    try {
        re_init_filterlist_apk();
        re_init_filterlist_month();

        console.log("inside filter function.");
        setApkFilter();
        setMonthFilter();
        calc_values();
        update_table();
    } catch (err) {
        console.log(err);
    }
    console.log("new filterList_apk is: " + filterList_apk);
    console.log("new filterList_service is: " + filterList_mois);


}

function reset_apk_filter() {
    for (var a = 0; a < ListApplication.length; a++) {
        var id_k = 'app_' + a;
        var apk = document.getElementById(id_k);
        apk.checked = false;
    }
    re_init_filterlist_apk();
    calc_values();
    update_table();
    console.log("filter apk reset");
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
    console.log("filter month reset");
}
function checkAllApks() {
    for (var a = 0; a < ListApplication.length; a++) {
        var id_k = 'app_' + a;
        var apk = document.getElementById(id_k);
        apk.checked = true;
    }
    check_all_filterList_apk();
    calc_values();
    update_table();

    console.log("filter all checked");
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

    console.log("filter all checked");
}


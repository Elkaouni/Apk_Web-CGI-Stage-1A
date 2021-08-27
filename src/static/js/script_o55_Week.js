// noinspection JSDuplicatedDeclaration

var listTMAHTML = document.getElementById('listTMA').innerText;
var listEquipeTMAHTML = document.getElementById('listEquipeTMA').innerText;
var Applications_venduesHTML = document.getElementById('Applications_vendues').innerText;
var ticket_countHTML = document.getElementById("ticket_count").innerText;

var ListTMA,  ListEquipeTMA, ListApplication, tickets;

ListTMA = JSON.parse(listTMAHTML);   //listPersonneParApkMois
ListEquipeTMA = JSON.parse(listEquipeTMAHTML);
ListApplication = JSON.parse(Applications_venduesHTML);
tickets = JSON.parse(ticket_countHTML);

//let last_month = ListTMA[ListTMA.length-1].MONTH;
//console.log("last_month -->" + last_month)

////////////////////////////////////////////////////////

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
    var date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

////////////////////////////////////////////////////////
let user_weeks=["","",""];
const c_nbWeek = 52;


// FILTERS --->>>
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
                "</label> ";
        } else if (i === 0 && j === 1) {
            cell.innerHTML = " <label for='check_all_apks'>" +
                "   <input id='check_all_apks' name='check_all_apks' onclick='checkAllApks()'" +
                "         type='button' value='Check All'>" +
                "</label> ";
        }
        else {
            try {
                cell.innerHTML = "<label for='app_" + count + "'> " +
                    "            <input id='app_" + count + "' name='" + ListApplication[count].APPLICATION_NAME + "' " +
                    "                checked type='checkbox' value='" + count + "' data-idx='" + count + "'" +
                    " onchange='setFilter()'>" + ListApplication[count].APPLICATION_NAME +
                    "        </label> ";
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
let filterList_apk = []; // 1 if service M filter fo apk_i up, else 0
for(var i=0; i < ListApplication.length ; i++){
    filterList_apk.push(1);
}
let filterWeek = [];
for(var i=0; i<53; i++){
    filterWeek.push([0,0,0,0,0,0,0]);
}
//////////////////////////////////////////////////////////////////////////

const thead = document.getElementById("thead_tma");
const tbody = document.getElementById("tbody_tma");
const nbSemaine = user_weeks.length;
function draw_head() {
    let head = thead.insertRow(0);
    let cell = head.insertCell(0);
    cell.rowSpan = 3;
    cell.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ;

    for(var s=0; s<nbSemaine; s++) {
        cell = head.insertCell(s+1);
        cell.colSpan = 5;
        var id = "s"+(s+1)
        cell.innerHTML = "<label for='week'></label>" +
            "<input id='"+id+"' type='week' name='week' >" +
            "<span class='validity'></span>";
        cell.name = id;
    }

    head = thead.insertRow(1)
    let sousHead = thead.insertRow(2)
    function insert_sous_services(j) {
        cell = sousHead.insertCell(j );
        cell.innerText = "M6";
        cell = sousHead.insertCell(j + 1);
        cell.innerText = "M7";
        cell = sousHead.insertCell(j + 2);
        cell.innerText = "M10";
        cell = sousHead.insertCell(j + 3);
        cell.innerText = "M11";
        cell = sousHead.insertCell(j + 4);
        cell.innerText = "M3/M4";
    }
    for(var s=0; s<nbSemaine; s++) {
        cell = head.insertCell(s);
        cell.colSpan = 5;
        cell.innerText = "Tickets Résolus (J)";
        insert_sous_services(5*s);
    }

    head = thead.insertRow(3)
    cell = head.insertCell(0);
    cell.innerText = "Objectif";
    for (var i = 0; i < 5*nbSemaine; i++) {
        cell = head.insertCell(i + 1);
        cell.innerText = 0;
        cell.style.backgroundColor = "#ffd2d2";
        cell.style.color = "#000000";
    }
}
function insert_obj(columns) {
    let head = thead.rows[3]
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

function drawTable(){
    draw_head();
    for(s=0; s<nbSemaine; s++){
        insert_obj(s);
    }

    for(var i=0; i< ListEquipeTMA.length ; i++) {
        let objectif_row = thead.rows[3];
        let row = tbody.insertRow(i);
        let staff = row.insertCell(0);
        staff.innerText = ListEquipeTMA[i].WORK_LOGGED_BY;
        for (var s = 0; s < nbSemaine; s++) {
            for (var j = 0; j < 5; j++) {    //ticket résolu
                let cell = row.insertCell(5 * s + j + 1);
                let text = 0;
                let objectif = objectif_row.cells[5 * s+ j + 1].innerText;

                if (text === "NA") {
                    cell.innerText = text;
                    cell.style.background = "none" ;
                }
                else if (text === 0) {
                    cell.innerText = "";
                    cell.style.background = "#c1c1c1"
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
                            cell.style.background = "#c1c1c1"
                        }
                    }
                }
            }
        }
    }

}
drawTable();

//////////////////////////////////////////////////////////////////////////


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


/////////  le code ne traitera que  les tickets résolus

//seperate each week's data
let week_imp=[], week_est = [];
for (var p = 0; p < ListEquipeTMA.length; p++) {
    week_imp.push([]);
    week_est.push([]);
    for (var serv = 0; serv < 5; serv++) {
        week_imp[p].push([]);
        week_est[p].push([]);
        for (var w = 0; w < 53; w++) {
            week_imp[p][serv].push([]);
            week_est[p][serv].push([]);

            week_imp[p][serv][w] = [[],[]]; //0: tickets, 1: imp des apk
            for (var apk = 0; apk < ListApplication.length ; apk++) {
                week_imp[p][serv][w][1].push(0)
                week_est[p][serv][w].push(0)
            }
        }
    }
}

var list_nullApk=[];
let serviceList=["M6","M7","M10","M11","M3","M4"]
for (var p = 0; p < ListEquipeTMA.length; p++) {
    for (var serv = 0; serv < serviceList.length; serv++) {
        for (var apk = 0; apk < ListApplication.length; apk++) {
            for (var item = 0; item < pList[p][1].length; item++) {
                var jour = pList[p][1][item].DAY;
                var mois = pList[p][1][item].MONTH -1;
                var year = pList[p][1][item].YEAR;
                var date = new Date(year, mois, jour);
                var date365 = 0;

                var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];

                var leapYear = new Date(year, 1, 29);
                if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
                    monthLength[1] = 29;
                }

                for ( var i=0; i < mois; i++ ) {
                    date365 = date365 + monthLength[i];
                }
                date365 = date365 + jour;

                var week = date.getWeek();

                var str = ListApplication[apk].APPLICATION_NAME;
                var str2 = pList[p][1][item].APPLICATION_NAME;
                if(str2 ===null) {
                    if(!(list_nullApk.includes(pList[p][1][item])))
                        list_nullApk.push(pList[p][1][item]);
                }
                else if (str2 === str
                        && pList[p][1][item].SELECT_LIST_1 === serviceList[serv] ) {

                    var imp = pList[p][1][item].HOURS;
                    var ss= serv;
                    if( serviceList[serv] === "M4"){
                        ss = serv-1;
                    }
                    week_imp[p][ss][week-1][1][apk] += imp;

                    if(pList[p][1][item].EXTERNAL_TICKET_ID !== null){
                        week_est[p][ss][week-1][apk] += imp;
                    }
                }
            }
        }
    }
}

//for items with null apk_name:
for (var p = 0; p < ListEquipeTMA.length; p++) {
    var serv = 0;
    for (var apk = 0; apk < ListApplication.length; apk++) {
        for (var item = 0; item < list_nullApk.length; item++) {
            var jour = list_nullApk[item].DAY;
            var mois = list_nullApk[item].MONTH -1;
            var year = list_nullApk[item].YEAR;
            var date = new Date(year, mois, jour);
            var date365 = 0;
            var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
            var leapYear = new Date(year, 1, 29);
            if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
                monthLength[1] = 29;
            }

            for ( var i=0; i < mois; i++ ) {
                date365 = date365 + monthLength[i];
            }
            date365 = date365 + jour;

            var week = date.getWeek();
            if (list_nullApk[item].WORK_LOGGED_BY === ListEquipeTMA[p].WORK_LOGGED_BY) {
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
                week_imp[p][serv][week-1][1][ListApplication.length] += imp;

                if(list_nullApk[item].EXTERNAL_TICKET_ID !== null){
                    week_est[p][ss][week-1][ListApplication.length] += imp;
                }
            }
        }
    }
}

for (var p = 0; p < ListEquipeTMA.length; p++) {
    for (var serv = 0; serv < serviceList.length; serv++) {
        for (var item = 0; item < tickets.length; item++) {
            var jour = tickets[item].DAY;
            var mois = tickets[item].MONTH -1;
            var year = tickets[item].YEAR;
            var date = new Date(year, mois, jour);
            var date365 = 0;
            var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
            var leapYear = new Date(year, 1, 29);
            if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
                monthLength[1] = 29;
            }

            for ( var i=0; i < mois; i++ ) {
                date365 = date365 + monthLength[i];
            }
            date365 = date365 + jour;

            var week = date.getWeek();
            if(tickets[item].WORK_LOGGED_BY === ListEquipeTMA[p].WORK_LOGGED_BY
            && tickets[item].SERVICE === serviceList[serv] ){
                var ss=serv;
                if(serv === 5)
                    ss = serv -1;
                week_imp[p][ss][week-1][0].push([tickets[item].APPLICATION_NAME, tickets[item].ISSUE]);
            }
        }
    }
}

let sum_filter=[]; //somme des imputations pour chaque serv
let sum_estimated=[];
for(var i =0; i<pList.length; i++ ){
    sum_filter.push([]);
    sum_estimated.push([]);
    for(var w =0; w<53; w++ ) {
        sum_filter[i].push([0, 0, 0, 0, 0, 0]);
        sum_estimated[i].push([0, 0, 0, 0, 0, 0]);
    }
}

function calc_values(){
    for(var p =0; p<pList.length ; p++){
        for(var serv = 0; serv<serviceList.length-1; serv++){
            for(var w = 0; w<53; w++){
                var tot=0, ss=0;
                for (var apk = 0; apk < ListApplication.length; apk++) {
                    tot += week_imp[p][serv][w][1][apk] * filterList_apk[apk];
                    ss += week_est[p][serv][w][apk]* filterList_apk[apk] ;
                }
                sum_filter[p][w][serv] = tot/8;
                sum_estimated[p][w][serv] = ss/8;
            }
        }
    }
}
calc_values();


////////// set filter

function update_table() {
    var selectedWeeks = []
    for(var w = 0; w<user_weeks.length; w++){
        selectedWeeks.push(0)
        if(user_weeks[w]=== "")
            selectedWeeks[w] = 0 ;
        else {
            var spotWeek = user_weeks[w].indexOf("W");
            var week = parseInt(user_weeks[w].substr(spotWeek + 1));
            selectedWeeks[w] = week
        }
    }


    let objectif_row = thead.rows[3];
    for(var i=0; i< ListEquipeTMA.length ; i++) {
        let row = tbody.rows[i];
        for (var week = 0; week < nbSemaine; week++) {
            for (var j = 0; j < 5; j++) {    //ticket
                let objectif = objectif_row.cells[5*week +j+1].innerText;
                let cell = row.cells[5*week + j+1];
                let text = 0;

                let w = selectedWeeks[week]-1;
                if(w === -1){
                    text = 0;
                }
                else {
                    text = sum_filter[i][w][j];
                    if (j < 4) {
                        var nb_ticket = 0;
                        var list_issues = [];

                        for (var l = 0; l < week_imp[i][j][w][0].length; l++) {
                            if (list_issues.includes(week_imp[i][j][w][0][l]) === false) {
                                for (var aa = 0; aa < filterList_apk.length; aa++) {
                                    if (filterList_apk[aa] === 1) {
                                        if (aa === ListApplication.length) {
                                            if (week_imp[i][j][w][0][l][0] === null) {
                                                list_issues.push(week_imp[i][j][w][0][l][1]);
                                            }
                                        } else {
                                            if (week_imp[i][j][w][0][l][0] === ListApplication[aa].APPLICATION_NAME) {
                                                list_issues.push(week_imp[i][j][w][0][l][1]);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        nb_ticket = list_issues.length;
                        if (nb_ticket !== 0) text = text / nb_ticket;
                        else text = 0;

                    }
                    else {   // M3/M4
                        if (sum_estimated[i][w][j] !== 0)
                            text = ((sum_estimated[i][w][j] - text) / sum_estimated[i][w][j]) * 100;
                        else
                            text = "NA";
                    }
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
    for (var i = 0; i < ListApplication.length; i++) {
        filterList_apk[i] = 0;
    }
}
function check_all_filterList_apk() {
    for (var i = 0; i < ListApplication.length; i++) {
        filterList_apk[i] = 1;
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
        setApkFilter();
        calc_values();
        update_table();
    } catch (err) {
        console.log(err);
    }
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

function confirmWeeks(){
    for(var i=0; i<user_weeks.length; i++){
        var id= "s"+(i+1);
        user_weeks[i] = document.getElementById(id).value;
    }
    setFilter();
}

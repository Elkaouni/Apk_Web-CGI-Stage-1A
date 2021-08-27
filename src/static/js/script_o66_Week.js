// noinspection UnnecessaryLocalVariableJS

var listTMAHTML = document.getElementById('listTMA').innerText;
var Applications_venduesHTML = document.getElementById('Applications_vendues').innerText;
var ticket_countHTML = document.getElementById("ticket_count").innerText;

var ListTMA = JSON.parse(listTMAHTML);   //listPersonneParApkMois
var ListApplication = JSON.parse(Applications_venduesHTML);
var tickets = JSON.parse(ticket_countHTML);

//let last_month = ListTMA[ListTMA.length-1].MONTH;

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

//////////////////////////////////////////////////////////////////////////
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
                    || ListTMA[i].RESOLUTION_PROGRESS === "ACKNOWLEDGMENT")
                {
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
                    || ListTMA[i].RESOLUTION_PROGRESS === "ACKNOWLEDGMENT")
                {
                    aList[a][1].push(ListTMA[i]);

                } else {
                    aList[a][2].push(ListTMA[i]);
                }
            }
        }
    }
}


/////////////////////////////////////////////////////////////////////////

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

    for(var i=0; i< aList.length ; i++) {
        let objectif_row = thead.rows[3];
        let row = tbody.insertRow(i);
        let staff = row.insertCell(0);
        if(aList[i][0] === null){
            staff.innerText = "Null";
        }
        else{
            staff.innerText = aList[i][0];
        }
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

/////////////////////////////////////////////////////////////////////////

//seperate each week's data
let week_imp=[], week_est = [];
for (var apk = 0; apk < aList.length; apk++) {
    week_imp.push([]);
    week_est.push([]);
    for (var serv = 0; serv < 5; serv++) {
        week_imp[apk].push([]);
        week_est[apk].push([]);
        for (var w = 0; w < 53; w++) {
            week_est[apk][serv].push(0); //imp for each apk in eac serv
            week_imp[apk][serv].push([[],0]); //0: tickets, 1: imp des apk
        }
    }
}

let serviceList=["M6","M7","M10","M11","M3","M4"]
for (var a = 0; a < aList.length; a++) {
    for (var serv = 0; serv < serviceList.length; serv++) {
        for (var item = 0; item < aList[a][1].length; item++) {
            var jour = aList[a][1][item].DAY;
            var mois = aList[a][1][item].MONTH -1;
            var year = aList[a][1][item].YEAR;
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

            if (aList[a][1][item].SELECT_LIST_1 === serviceList[serv] ) {

                var imp = aList[a][1][item].HOURS;
                var ss= serv;
                if( serviceList[serv] === "M4"){
                    ss = serv-1;
                }
                week_imp[a][ss][week-1][1] += imp;

                if(aList[a][1][item].EXTERNAL_TICKET_ID !== null){
                    week_est[a][ss][week-1] += aList[a][1][item].ESTIMATED_EFFORT;
                }
            }
        }
    }
}

for (var a = 0; a < aList.length; a++) {
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

            if(tickets[item].APPLICATION_NAME === aList[a][0]
                && tickets[item].SERVICE === serviceList[serv]){
                var ss=serv;
                if(serv === 5)
                    ss = serv -1;
                week_imp[a][ss][week-1][0].push([tickets[item].APPLICATION_NAME, tickets[item].ISSUE]);
            }
        }
    }
}


let sum_filter=[]; //somme des imputations pour chaque serv
let sum_estimated=[];
for(var i =0; i<aList.length; i++ ){
    sum_filter.push([]);
    sum_estimated.push([]);
    for(var w =0; w<53; w++ ) {
        sum_filter[i].push([0, 0, 0, 0, 0, 0]);
        sum_estimated[i].push([0, 0, 0, 0, 0, 0]);
    }
}

function calc_values(){
    for(var a =0; a<aList.length ; a++){
        for(var serv = 0; serv<serviceList.length-1; serv++){
            for(var w = 0; w<53; w++) {
                var tot = 0, ss = 0;
                tot = week_imp[a][serv][w][1];
                ss = week_est[a][serv][w];

                sum_filter[a][w][serv] = tot / 8;
                sum_estimated[a][w][serv] = ss / 8;
            }
        }
    }
}
calc_values();


let old_charts = [];
function drawChart() {

    let canvas = document.getElementById("canvas");
    let nbColumn = 3;
    let nbRows = Math.trunc(ListApplication.length / nbColumn) + 1;

    var values = sum_filter;
    for(var i=0; i< aList.length; i++){
        for(var w=0; w< 53; w++) {
            for (var j = 0; j < 5; j++) {
                values[i][w][j] = sum_filter[i][w][j];
                var nb_ticket = 0;
                var list_issues = [];

                for (var l = 0; l < week_imp[i][j][w][0].length; l++) {
                    if (list_issues.includes(week_imp[i][j][w][0][l]) === false) {
                        list_issues.push(week_imp[i][j][w][0][l]);
                    }
                }

                nb_ticket = list_issues.length;
                if (nb_ticket !== 0) values[i][w][j] = values[i][w][j] / nb_ticket;
                else values[i][w][j] = 0;
            }
        }
    }
    

    let s1 = [], s2 = [], s3 = [];
    for (var i = 0; i < ListApplication.length; i++) {
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
        if(selectedWeeks[0] !== 0)
            s1.push(values[i][selectedWeeks[0]-1]);
        else
            s1.push([]);

        if(selectedWeeks[1] !== 0)
            s2.push(values[i][selectedWeeks[1]-1]);
        else
            s2.push([]);

        if(selectedWeeks[2] !== 0)
            s3.push(values[i][selectedWeeks[2]-1]);
        else
            s3.push([]);
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
            let set_ij_s1 = {
                type: 'bar',
                label: user_weeks[0],
                data: s1[num_id],
                borderColor: "blue",
                backgroundColor: "blue",
                order: 1
            };
            let set_ij_s2 = {
                type: 'bar',
                label: user_weeks[1],
                data: s2[num_id],
                borderColor: "orange",
                backgroundColor: "orange",
                order: 1
            };
            let set_ij_s3 = {
                type: 'bar',
                label: user_weeks[2],
                data: s3[num_id],
                borderColor: "grey",
                backgroundColor: "grey",
                order: 1
            };

            var dataset_ij = [set_ij_s1, set_ij_s2, set_ij_s3, obj_total];
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
                            align: 'center',
                            position: 'top',
                            font: {weight: 'bold'}
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
    for(var i=0; i< aList.length ; i++) {
        let row = tbody.rows[i];
        for (var week = 0; week < nbSemaine; week++) {
            for (var j = 0; j < 5; j++) {
                let cell = row.cells[5 * week + j + 1];
                let text = 0;
                let objectif = objectif_row.cells[5 * week + j + 1].innerText;

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
                                list_issues.push(week_imp[i][j][w][0][l]);
                            }
                        }


                        nb_ticket = list_issues.length;
                        if (nb_ticket !== 0) text = text / nb_ticket;
                        else text = 0;

                    } else {   // M3/M4
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
                else if (text === 0) {
                    cell.innerText = "";
                    cell.style.background = "#c1c1c1"
                }
                else{
                    cell.innerText = text.toFixed(2);
                    if (j === 4) {
                        if (text === "NA") {
                            cell.innerText = text;
                            cell.style.background = "none" ;
                        }
                        else {
                            if(cell.innerText !== "NA")
                                cell.innerText+= " %";
                            if (text > 0)
                                cell.style.background = "#b3ffb0"
                            else
                                cell.style.background = "#ffb0b0"
                        }
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

function setFilter() {
    try {
        calc_values();
        update_table();
        update_chart();
    } catch (err) {
        console.log(err);
    }
}

function confirmWeeks(){
    for(var i=0; i<user_weeks.length; i++){
        var id= "s"+(i+1);
        user_weeks[i] = document.getElementById(id).value;
    }
    setFilter();
}

var list1 = document.getElementById('listPersonneParApkMois').innerText;
var list2 = document.getElementById('ListApplication').innerText;
var list3 = document.getElementById('ListPersonne').innerText;
var obj1 = document.getElementById('commande_vendu_m1').innerText;
var obj2 = document.getElementById('commande_vendu_m2').innerText;
var obj9 = document.getElementById('commande_vendu_m9').innerText;
var av = document.getElementById('listAvenant').innerText;

var commande_vendu_m1 = JSON.parse(obj1);
var commande_vendu_m2 = JSON.parse(obj2);
var commande_vendu_m9 = JSON.parse(obj9);

var items = JSON.parse(list1);   //listPersonneParApkMois
var ListApplication = JSON.parse(list2);
var ListPersonne = JSON.parse(list3);
var listAvenant = JSON.parse(av) ;

let list_obj = [commande_vendu_m1, commande_vendu_m2, commande_vendu_m9];

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
let user_weeks= "";
const c_nbWeek = 52;
const YEAR = items[0].YEAR ;

/*////////////////////////////////////////////*/

const table = document.getElementById("table_personne_par_apk");
const table_head = document.getElementById("head_personne_par_apk");


//first sort items PER staff
let pList = [];
for (var p = 0; p < ListPersonne.length; p++) {
    pList.push([ListPersonne[p].WORK_LOGGED, []]); //liste vide per personne
    for (var i = 0; i < items.length; i++) {
        if (items[i].WORK_LOGGED === ListPersonne[p].WORK_LOGGED) {
            pList[p][1].push(items[i]);
        }
    }
}

function draw_head(){
    let head = table_head.insertRow(0)
    let cell = head.insertCell(0);
    cell.rowSpan = 2;
    cell = head.insertCell(1);
    cell.colSpan = ListApplication.length ;
    cell.innerHTML= "<label for='week'></label>" +
        "<input id='s1' type='week' name='week' >" +
        "<span class='validity'></span>" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "<button onclick='confirmWeeks()' " +
        "id='confirmer'>Confirmer les semaines" +
        "</button>" ;
    cell.name = "s1";

    head = table_head.insertRow(1)
    for (let k = 0; k < ListApplication.length; k++) {
        let apk = head.insertCell(k);
        apk.innerHTML = ListApplication[k].APPLICATION_NAME;
    }

//insert head obj of table
    let obj = table_head.insertRow(2)
    cell = obj.insertCell(0);
    cell.innerText = "objecttf";
    for (let k = 0; k < ListApplication.length; k++)    {
        let objecttf = obj.insertCell(k + 1);
        let obj_total = 0;

        if(user_weeks !== "") {
            obj_total = (list_obj[0][k].M1 + list_obj[1][k].M2 + list_obj[2][k].M9) / c_nbWeek;
            objecttf.innerHTML = obj_total.toFixed(2);
        }
        else{
            objecttf.innerHTML ="";
        }
    }
}
function draw_table(){
    draw_head();

    for (i = 0; i < pList.length; i++) {
        let row = table.insertRow(i);
        let persName = row.insertCell(0);
        persName.innerHTML = pList[i][0];
        for (let j = 0; j < ListApplication.length; j++) {
            let apk = row.insertCell(j + 1);
            let text = '';
            if (text !== 0) apk.innerText = text;
            else apk.innerText = '';
        }
    }

    let final_row = table.insertRow(pList.length);
    let global = final_row.insertCell(0);
    global.innerText = "Zprod Global";
    global.style.backgroundColor = "rgba(198, 0, 0, 0.85)";
    global.style.color = "white";

    for (let j = 0; j < ListApplication.length; j++) {
        let prod = final_row.insertCell(j + 1);
        let get_obj = table_head.rows[2].cells[j + 1];
        let obj = parseFloat(get_obj.innerText)
        if(isNaN(obj)){
            prod.innerText = "";
        }
        else{
            if (obj === 0) {
                prod.innerText = "NC";
                prod.style.background= "none";
            }
            else {
                let s = 0;
                for (var k = 0; k < pList.length; k++) {
                    let cell = table.rows[k].cells[j + 1].innerText;
                    if (Number.isNaN(parseFloat(cell))) {
                        s += 0;
                    } else {
                        s += parseFloat(cell);
                    }
                }
                let total = ((obj - s) / obj * 100).toFixed(1);
                prod.innerText = total + "%";

                if (total < 0) prod.style.backgroundColor = "#ffb0b0";
                else if (total > 0) prod.style.backgroundColor = "#b3ffb0";
                else prod.style.backgroundColor = "rgba(255,255,255,0)";
            }
        }
    }
}
draw_table();

function mark_empty() {
    for (var j = 1; j < ListApplication.length + 1; j++) {
        let empty = true;
        for (var i = 0; i < pList.length; i++) {
            let row = table.rows[i];
            if (row.cells[j].innerText !== "") {
                empty = false;
                break
            }
        }
        if (empty === true) {
            for (var i = 0; i < pList.length; i++) {
                let row = table.rows[i];
                row.cells[j].style.background = "#ababab";
            }
        } else {
            for (var i = 0; i < pList.length; i++) {
                let row = table.rows[i];
                row.cells[j].style.background = "none";
            }
        }
    }
}
mark_empty();


///////////////////// exemple for M1

//init lists
let filterList_service = [1, 1, 1]; // 1 if service M filter fo apk_i up, else 0 
let p_service_year_row = [];

for (var k = 0; k < ListPersonne.length; k++) {
    p_service_year_row.push([]);
    for (var i = 0; i < ListApplication.length; i++) {
        p_service_year_row[k].push([[], [], []]);
        for (var j = 0; j < 3; j++) {     // month par service par apk
            for (var w = 0; w < 53; w++) {     // month par service par apk
                p_service_year_row[k][i][j].push(0);
            }
        }
    }
}


//prepare the table's values
for (var p = 0; p < ListPersonne.length; p++) {
    for (var apk = 0; apk < ListApplication.length; apk++) {
        var serv = 0;
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

            let name_length = pList[p][1][item].APPLICATION.length;
            if (pList[p][1][item].APPLICATION === ListApplication[apk].APPLICATION_NAME.substr(0, name_length)) {
                let service = pList[p][1][item].SERVICE;
                if (service === "M1") {
                    serv = 0;
                } else if (service === "M2") {
                    serv = 1;
                } else if (service === "M9") {
                    serv = 2;
                }
                p_service_year_row[p][apk][serv][week-1] += pList[p][1][item].IMPUTATION;
            }
        }
    }
}

var p_total_filter_imp = []; //sum imp de chaque apk avec filtre
for (var i = 0; i < ListPersonne.length; i++) {
    p_total_filter_imp.push([]);
    for (var k = 0; k < ListApplication.length; k++) {
        p_total_filter_imp[i].push([]);
        for (var w = 0; w < 53; w++) {
            p_total_filter_imp[i][k].push(0);
        }
    }
}

function calc_tableValues() {
    for (var p = 0; p < ListPersonne.length; p++) {
        for (var apk = 0; apk < ListApplication.length; apk++) {
            for (var w = 0; w < 53; w++) {
                var s = 0;
                for (var serv = 0; serv < 3; serv++){
                    s += p_service_year_row[p][apk][serv][w] * filterList_service[serv];
                }
                p_total_filter_imp[p][apk][w] = s;
            }
        }
    }
}
calc_tableValues();


//Bar chart

let old_charts = [];
function drawChart() {
    var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
    var leapYear = new Date(YEAR, 1, 29);
    if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
        monthLength[1] = 29;
    }

    var selectedWeek = 0;
    if(user_weeks !== ""){
        var spotWeek = user_weeks.indexOf("W");
        var week = parseInt(user_weeks.substr(spotWeek + 1));
        selectedWeek = week
    }
    let weekNum = selectedWeek-1;

    let vendu = [];
    for (var k = 0; k < ListApplication.length; k++) {
        var total = 0;
        if(weekNum !==-1) {
            let obj1 = commande_vendu_m1[k].M1 / c_nbWeek
            let obj2 = commande_vendu_m2[k].M2 / c_nbWeek
            let obj9 = commande_vendu_m9[k].M9 / c_nbWeek

            for (var av = 0; av < listAvenant.length; av++) {
                if (listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME) {
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var av_vendu = listAvenant[av].M1;
                    av_vendu = (av_vendu - 0.037 * av_vendu) / 393.02;

                    var debutDate = new Date(YEAR, debut - 1, 1)
                    var finDate = new Date(YEAR, fin - 1, monthLength[fin - 1])

                    var debutWeek = debutDate.getWeek();
                    var finWeek = finDate.getWeek();

                    if (weekNum + 1 >= debutWeek && weekNum + 1 <= finWeek) {
                        var nb_jour = 0;
                        for (var l = debut - 1; l < fin; l++) {
                            nb_jour += monthLength[l]
                        }
                        obj1 += (av_vendu / nb_jour * 7);
                    }
                }
            }
            for (var av = 0; av < listAvenant.length; av++) {
                if (listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME) {
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var av_vendu = listAvenant[av].M2;
                    av_vendu = (av_vendu - 0.037 * av_vendu) / 393.02;

                    var debutDate = new Date(YEAR, debut - 1, 1)
                    var finDate = new Date(YEAR, fin - 1, monthLength[fin - 1])

                    var debutWeek = debutDate.getWeek();
                    var finWeek = finDate.getWeek();

                    if (weekNum + 1 >= debutWeek && weekNum + 1 <= finWeek) {
                        var nb_jour = 0;
                        for (var l = debut - 1; l < fin; l++) {
                            nb_jour += monthLength[l]
                        }
                        obj2 += (av_vendu / nb_jour * 7);
                    }
                }
            }
            for (var av = 0; av < listAvenant.length; av++) {
                if (listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME) {
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var av_vendu = listAvenant[av].M9;
                    av_vendu = (av_vendu - 0.037 * av_vendu) / 393.02;

                    var debutDate = new Date(YEAR, debut - 1, 1)
                    var finDate = new Date(YEAR, fin - 1, monthLength[fin - 1])

                    var debutWeek = debutDate.getWeek();
                    var finWeek = finDate.getWeek();

                    if (weekNum + 1 >= debutWeek && weekNum + 1 <= finWeek) {
                        var nb_jour = 0;
                        for (var l = debut - 1; l < fin; l++) {
                            nb_jour += monthLength[l]
                        }
                        obj9 += (av_vendu / nb_jour * 7);
                    }
                }
            }

            total = (obj1 * filterList_service[0]
                + obj2 * filterList_service[1]
                + obj9 * filterList_service[2]);
        }
       
        vendu.push(total);
    }
    let obj_total = {
        type: 'line',
        label: 'Objectif',
        data: vendu,
        borderColor: "#e50000",
        order: 0,
        borderDash: [10, 5],
        borderWidth: 2,
        backgroundColor: "rgba(255,255,255,0)",
    };

    let constate = [];
    for (var a = 0; a < ListApplication.length; a++) {
        let s = 0;
        for (var k = 0; k < pList.length; k++) {
            let cell = table.rows[k].cells[a + 1].innerText;
            if (Number.isNaN(parseFloat(cell))) {
                s += 0;
            } else {
                s += parseFloat(cell);
            }
        }
        constate.push(s);
    }
    let constate_total = {
        type: 'line',
        label: 'Total constaté',
        data: constate,
        borderColor: "#00e56f",
        order: 0,
        borderDash: [10, 5],
        borderWidth: 2,
        backgroundColor: "rgba(255,255,255,0)",
    };

    const labels = [];
    for (var i = 0; i < ListApplication.length; i++) {
        labels.push(ListApplication[i].APPLICATION_NAME);
    }
    let id = 'id';

    var dataset_ij = [ obj_total, constate_total];
    const data_ij = {
        labels: labels,
        datasets: dataset_ij
    };
    const config_ij = {
        type: 'bar',
        data: data_ij,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        fontSize: 20,
                    }
                }
            },
        },
    };
    var chart = new Chart(id, config_ij);

    old_charts.push(chart);
}
drawChart();


////////// set filter

function update_table() {
    var selectedWeek = 0;
    if(user_weeks !== ""){
        var spotWeek = user_weeks.indexOf("W");
        var week = parseInt(user_weeks.substr(spotWeek + 1));
        selectedWeek = week
    }

    var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
    var leapYear = new Date(YEAR, 1, 29);
    if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
        monthLength[1] = 29;
    }

    let obj = table_head.rows[2];
    for (let k = 0; k < ListApplication.length; k++) {
        let objecttf = obj.cells[k + 1];
        let obj_total = 0;
        let weekNum = selectedWeek-1;

        let obj1 = list_obj[0][k].M1 / c_nbWeek
        let obj2 = list_obj[1][k].M2 / c_nbWeek
        let obj9 = list_obj[2][k].M9 / c_nbWeek

        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M1;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;

                var debutDate = new Date(YEAR, debut-1, 1)
                var finDate = new Date(YEAR, fin-1, monthLength[fin-1])

                var debutWeek = debutDate.getWeek();
                var finWeek = finDate.getWeek();

                if(weekNum+1 >= debutWeek && weekNum+1<= finWeek){
                    var nb_jour = 0;
                    for(var l=debut-1; l<fin; l++){
                        nb_jour += monthLength[l]
                    }
                    obj1 += (vendu/nb_jour * 7);
                }
            }
        }
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M2;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;

                var debutDate = new Date(YEAR, debut-1, 1)
                var finDate = new Date(YEAR, fin-1, monthLength[fin-1])

                var debutWeek = debutDate.getWeek();
                var finWeek = finDate.getWeek();

                if(weekNum+1 >= debutWeek && weekNum+1<= finWeek){
                    var nb_jour = 0;
                    for(var l=debut-1; l<fin; l++){
                        nb_jour += monthLength[l]
                    }
                    obj2 += (vendu/nb_jour * 7);
                }
            }
        }
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M9;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;

                var debutDate = new Date(YEAR, debut-1, 1)
                var finDate = new Date(YEAR, fin-1, monthLength[fin-1])

                var debutWeek = debutDate.getWeek();
                var finWeek = finDate.getWeek();

                if(weekNum+1 >= debutWeek && weekNum+1<= finWeek){
                    var nb_jour = 0;
                    for(var l=debut-1; l<fin; l++){
                        nb_jour += monthLength[l]
                    }
                    obj9 += (vendu/nb_jour * 7);
                }
            }
        }

        obj_total = ( obj1 * filterList_service[0]
            + obj2 * filterList_service[1]
            + obj9 * filterList_service[2] );

        objecttf.innerHTML = obj_total.toFixed(2);
    }

    for (i = 0; i < pList.length; i++) {
        let row = table.rows[i];
        for (let j = 0; j < ListApplication.length; j++) {
            let apk = row.cells[j + 1];
            let text = '';
            let weekNum = selectedWeek-1;
            if(weekNum === -1){
                text = 0;
            }
            else
                text = p_total_filter_imp[i][j][weekNum];

            if (text !== 0) apk.innerText = text.toFixed(2);
            else apk.innerText = '';
        }
    }

    let final_row = table.rows[pList.length];
    for (let j = 0; j < ListApplication.length; j++) {
        let prod = final_row.cells[j + 1];
        let get_obj = table_head.rows[2].cells[j + 1];
        let obj = parseFloat(get_obj.innerText)
        if (obj === 0) {
            prod.innerText = "NC";
            prod.style.background= "none";
        } else {
            let s = 0;
            for (var k = 0; k < pList.length; k++) {
                let cell = table.rows[k].cells[j + 1].innerText;
                if (Number.isNaN(parseFloat(cell))) {
                    s += 0;
                } else {
                    s += parseFloat(cell);
                }
            }
            let total = ((obj - s) / obj * 100).toFixed(1);
            prod.innerText = total + "%";

            if (total < 0) prod.style.backgroundColor = "#ffb0b0";
            else if (total > 0) prod.style.backgroundColor = "#b3ffb0";
            else prod.style.backgroundColor = "rgba(255,255,255,0)";
        }
    }

    mark_empty();
}

function update_chart() {
    for (var i = 0; i < old_charts.length; i++) {
        old_charts[i].destroy()
    }
    drawChart();
}

function re_init_filterlist_service() {
    filterList_service = [0, 0, 0];
}
function check_all_filterList_service() {
    filterList_service = [1, 1, 1];
}
function setServiceFilter() {
    try {
        for (var a = 0; a < filterList_service.length; a++) {
            var id_k = '';
            switch (a) {
                case 0: {
                    id_k = 'm1';
                    break;
                }
                case 1: {
                    id_k = 'm2';
                    break;
                }
                case 2: {
                    id_k = 'm9';
                    break;
                }
            }
            var serv = document.getElementById(id_k);
            if (serv.checked) {
                filterList_service[a] = 1;
            } else {
                filterList_service[a] = 0;
            }
        }
    } catch (err) {
        console.log(err);
    }
}
function setFilter() {
    try {
        re_init_filterlist_service();
        setServiceFilter();
        calc_tableValues();
        update_table();
        update_chart();
    } catch (err) {
        console.log(err);
    }
}
function reset_service_filter() {
    for (var a = 0; a < filterList_service.length; a++) {
        var id_k = '';
        switch (a) {
            case 0:
                id_k = 'm1';
                break;
            case 1:
                id_k = 'm2';
                break;
            case 2:
                id_k = 'm9';
                break;
        }
        var serv = document.getElementById(id_k);
        serv.checked = false;
    }
    re_init_filterlist_service();
    calc_tableValues();
    update_table();
    update_chart();

    console.log("filter service reset");
}
function checkAllServices() {
    var serv1 = document.getElementById('m1');
    var serv2 = document.getElementById('m2');
    var serv9 = document.getElementById('m9');
    serv1.checked = true;
    serv2.checked = true;
    serv9.checked = true;
    check_all_filterList_service();
    calc_tableValues();
    update_table();
    update_chart();
    console.log("filter all checked");
}

function confirmWeeks(){
    var id= "s1";
    user_weeks = document.getElementById(id).value;
    setFilter();
}

var error =document.getElementById("error");
var objList = [];
for (var i = 0; i < ListApplication.length; i++) {
    for (var j = 0; j < commande_vendu_m1.length; j++) {
        var str1 = commande_vendu_m1[j].APPLICATIONS.toUpperCase();
        var str2 = ListApplication[i].APPLICATION_NAME.toUpperCase();
        var space1 = str1.indexOf("  ");
        str1 = str1.substr(0,space1);   // in case there s many spaces aftr the name
        if (str1.includes(str2) || str2.includes(str1)) {
            objList.push(ListApplication[i].APPLICATION_NAME);
        }
    }
}
/*
console.log("ListApplication")
console.log(ListApplication)
console.log("commande_vendu_m1")
console.log(commande_vendu_m1)
console.log("objList")
console.log(objList)
console.log("compare results:")
for(var k=0; k<ListApplication.length; k++){
console.log(ListApplication[k].APPLICATION_NAME + "  |  "+ commande_vendu_m1[k].APPLICATIONS
    + "  |  "+ objList[k] + "\n")
}    */

if(objList.length !== ListApplication.length || objList.length !== commande_vendu_m1.length){
    error.innerHTML= "Veuillez vérifier si les noms des applications dans la table des commandes" +
        +'<br/>'+"et dans la table des imputations sont les mêmes";
    error.style.color = "#ba0000"
}
else{
    error.innerHTML="";
}
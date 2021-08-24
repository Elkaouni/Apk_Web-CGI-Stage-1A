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

let last_month = items[items.length-1].MONTH ;
let list_obj = [commande_vendu_m1, commande_vendu_m2, commande_vendu_m9];

const table = document.getElementById("table_personne_par_apk");
const table_head = document.getElementById("head_personne_par_apk");

/*////////////////////////////////////////////*/

//month filter
let monthsList = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet',
    'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

let monthLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
    'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];


let filter_table = document.getElementById("filter_table");
var mois = 0;
let nb_columns = last_month + 2;
let row = filter_table.insertRow(0);
for (var j = 0; j < nb_columns; j++) {
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

let pList = [];
//first sort items PER staff
for (var p = 0; p < ListPersonne.length; p++) {
    pList.push([ListPersonne[p].WORK_LOGGED, []]); //liste vide per personne
    for (var i = 0; i < items.length; i++) {
        if (items[i].WORK_LOGGED === ListPersonne[p].WORK_LOGGED) {
            pList[p][1].push(items[i]);
        }
    }
}


//init lists
let filterList_mois = []; // 1 if apk filter fo apk_i up, else 0
for(var i=0; i<last_month; i++){
    filterList_mois.push(1);
}
let filterList_service = [1, 1, 1]; // 1 if service M filter fo apk_i up, else 0

let p_service_month_row = [];

for (var k = 0; k < ListPersonne.length; k++) {
    p_service_month_row.push([]); //les personnes
    for (var i = 0; i < ListApplication.length; i++) {
        p_service_month_row[k].push([]); //les apk par personnes
        for (var j = 0; j < 3; j++) {     // month par service par apk
            p_service_month_row[k][i].push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }
}



//prepare the table's values
for (var p = 0; p < ListPersonne.length; p++) {
    for (var apk = 0; apk < ListApplication.length; apk++) {
        var serv = 0;
        for (var mois = 0; mois < 12; mois++) {
            for (var item = 0; item < pList[p][1].length; item++) {
                let name_length = pList[p][1][item].APPLICATION.length;
                if (pList[p][1][item].MONTH === mois + 1 &&
                    pList[p][1][item].APPLICATION === ListApplication[apk].APPLICATION_NAME.substr(0, name_length)) {
                    let service = pList[p][1][item].SERVICE;
                    if (service === "M1") {
                        serv = 0;
                    } else if (service === "M2") {
                        serv = 1;
                    } else if (service === "M9") {
                        serv = 2;
                    }
                    p_service_month_row[p][apk][serv][mois] += pList[p][1][item].IMPUTATION;
                }
            }
        }
    }
}

var p_total_filter_imp = []; //sum imp de chaque apk avec filtre

for (i = 0; i < ListPersonne.length; i++) {
    p_total_filter_imp.push([]);
    for (var k = 0; k < ListApplication.length; k++) {
        p_total_filter_imp[i].push(0);
    }
}

function calc_tableValues() {
    for (var p = 0; p < ListPersonne.length; p++) {
        for (var apk = 0; apk < ListApplication.length; apk++) {
            var s = 0;
            for (var serv = 0; serv < 3; serv++) {
                for (var mois = 0; mois < last_month; mois++) {
                    s += p_service_month_row[p][apk][serv][mois] * filterList_mois[mois] * filterList_service[serv];
                }
            }
            p_total_filter_imp[p][apk] = s;
        }
    }
}
calc_tableValues();


//insert head of table
    let head = table_head.insertRow(0)
    head.insertCell(0);
    for (let k = 0; k < ListApplication.length; k++) {
        let apk = head.insertCell(k + 1);
        apk.innerHTML = ListApplication[k].APPLICATION_NAME;
    }

//insert head obj of table
    let obj = table_head.insertRow(1)
    let cell = obj.insertCell(0);
    cell.innerText = "objecttf";
    for (let k = 0; k < ListApplication.length; k++)    {
        let objecttf = obj.insertCell(k + 1);
        let obj_total = 0;
        let filter_mois_on = 0;
        for (var a = 0; a < last_month; a++) {
            filter_mois_on += filterList_mois[a];
        }

        let obj1 = list_obj[0][k].M1 * filter_mois_on / 12
        let obj2 = list_obj[1][k].M2 * filter_mois_on / 12
        let obj9 = list_obj[2][k].M9 * filter_mois_on / 12

        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M1;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        obj1 += vendu/(fin-debut+1) * filterList_mois[mois];
                    }
                }
            }
        }
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M2;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        obj2 += vendu/(fin-debut+1) * filterList_mois[mois];
                    }
                }
            }
        }
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M9;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        obj9 += vendu/(fin-debut+1) * filterList_mois[mois];
                    }
                }
            }
        }

        obj_total = (obj1 * filterList_service[0] +
            obj2 * filterList_service[1] +
            obj9 * filterList_service[2]) ;

        objecttf.innerHTML = obj_total.toFixed(2);
    }

//now insert in table
    for (var i = 0; i < pList.length; i++) {
        let row = table.insertRow(i);
        let persName = row.insertCell(0);
        persName.innerHTML = pList[i][0];

        for (let j = 0; j < ListApplication.length; j++) {
            let apk = row.insertCell(j + 1);
            let filter_mois_on = 0, filter_service_on = 0;
            for (var k = 0; k < last_month; k++) {
                filter_mois_on += filterList_mois[k];
            }
            for (var k = 0; k < 3; k++) {
                filter_service_on += filterList_service[k];
            }
            let text = '';
            text = p_total_filter_imp[i][j].toFixed(2);

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
        let get_obj = table_head.rows[1].cells[j + 1];
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


//Bar chart
    let old_charts = [];
    function drawChart() {
        let filter_mois_on = 0, filter_service_on = 0;
        for (var k = 0; k < last_month; k++) {
            filter_mois_on += filterList_mois[k];
        }
        for (var k = 0; k < filterList_service.length; k++) {
            filter_service_on += filterList_service[k];
        }

        let vendu = [];
        for (var k = 0; k < ListApplication.length; k++) {
            let total = 0;
            let obj1 = commande_vendu_m1[k].M1 * filter_mois_on / 12 ;
            let obj2 = commande_vendu_m2[k].M2 * filter_mois_on / 12  ;
            let obj9 = commande_vendu_m9[k].M9 * filter_mois_on / 12   ;

            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu_av = listAvenant[av].M1;
                    vendu_av = (vendu_av - 0.037 * vendu_av) / 393.02  ;
                    for(var mois=0; mois<last_month; mois++){
                        if(mois+1 >= debut && mois+1<= fin)
                        {
                            obj1 += vendu_av/(fin-debut+1) * filterList_mois[mois];
                        }
                    }
                }
            }
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu_av = listAvenant[av].M2;
                    vendu_av = (vendu_av - 0.037 * vendu_av) / 393.02  ;
                    for(var mois=0; mois<last_month; mois++){
                        if(mois+1 >= debut && mois+1<= fin)
                        {
                            obj2 += vendu_av/(fin-debut+1) * filterList_mois[mois];
                        }
                    }
                }
            }
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu_av = listAvenant[av].M9;
                    vendu_av = (vendu_av - 0.037 * vendu_av) / 393.02  ;
                    for(var mois=0; mois<last_month; mois++){
                        if(mois+1 >= debut && mois+1<= fin)
                        {
                            obj9 += vendu_av/(fin-debut+1) * filterList_mois[mois];
                        }
                    }
                }
            }

            total = (obj1 * filterList_service[0] +
                obj2 * filterList_service[1] +
                obj9 * filterList_service[2]) ;

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
    let obj = table_head.rows[1];
    for (let k = 0; k < ListApplication.length; k++) {
        let objecttf = obj.cells[k + 1];
        let obj_total = 0;
        let filter_mois_on = 0;
        for (var a = 0; a < last_month; a++) {
            filter_mois_on += filterList_mois[a];
        }
        let obj1 = list_obj[0][k].M1 * filter_mois_on / 12
        let obj2 = list_obj[1][k].M2 * filter_mois_on / 12
        let obj9 = list_obj[2][k].M9 * filter_mois_on / 12

        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M1;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        obj1 += vendu/(fin-debut+1) * filterList_mois[mois];
                    }
                }
            }
        }
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M2;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        obj2 += vendu/(fin-debut+1) * filterList_mois[mois];
                    }
                }
            }
        }
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M9;
                vendu = (vendu - 0.037 * vendu) / 393.02  ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        obj9 += vendu/(fin-debut+1) * filterList_mois[mois];
                    }
                }
            }
        }

        obj_total = (obj1 * filterList_service[0] +
            obj2 * filterList_service[1] +
            obj9 * filterList_service[2]) ;

        objecttf.innerHTML = obj_total.toFixed(2);
    }

    for (var i = 0; i < pList.length; i++) {
        let row = table.rows[i];
        for (let j = 0; j < ListApplication.length; j++) {
            let apk = row.cells[j + 1];
            let filter_mois_on = 0, filter_service_on = 0;
            for (var k = 0; k < last_month; k++) {
                filter_mois_on += filterList_mois[k];
            }
            for (var k = 0; k < 3; k++) {
                filter_service_on += filterList_service[k];
            }
            let text = '';
            text = p_total_filter_imp[i][j].toFixed(2);
            if (text !== 0) apk.innerText = text;
            else apk.innerText = '';
        }
    }

    for (let j = 0; j < ListApplication.length; j++) {
        let prod = final_row.cells[j + 1];
        let get_obj = table_head.rows[1].cells[j + 1];
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

function re_init_filterlist_month() {
    for (var i = 0; i < last_month; i++) {
        filterList_mois[i] = 0;
    }
}
function re_init_filterlist_service() {
    filterList_service = [0, 0, 0];
}
function check_all_filterList_mois() {
    for (var i = 0; i < filterList_mois.length; i++) {
        filterList_mois[i] = 1;
    }
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
        re_init_filterlist_service();
        setMonthFilter();
        setServiceFilter();
        calc_tableValues();
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
    calc_tableValues();
    update_table();
    update_chart();
    console.log("filter month reset");
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
function checkAllMonths() {
    for (var a = 0; a < last_month; a++) {
        var id_k = monthsList[a];
        var apk = document.getElementById(id_k);
        apk.checked = true;
    }
    check_all_filterList_mois();
    calc_tableValues();
    update_table();
    update_chart();

    console.log("filter all checked");
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
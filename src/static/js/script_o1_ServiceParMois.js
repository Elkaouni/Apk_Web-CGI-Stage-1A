var list1 = document.getElementById('listServiceParApkMois').innerText;
var list2 = document.getElementById('ListApplication').innerText;
var obj1 = document.getElementById('commande_vendu_m1').innerText;
var obj2 = document.getElementById('commande_vendu_m2').innerText;
var obj9 = document.getElementById('commande_vendu_m9').innerText;
var av = document.getElementById('listAvenant').innerText;

var items = JSON.parse(list1);
var ListApplication = JSON.parse(list2);
var commande_vendu_m1 = JSON.parse(obj1);
var commande_vendu_m2 = JSON.parse(obj2);
var commande_vendu_m9 = JSON.parse(obj9);
var listAvenant = JSON.parse(av) ;

let first_chart;
let list_obj = [commande_vendu_m1, commande_vendu_m2, commande_vendu_m9];
const table = document.getElementById("table_service_par_mois");
let last_month = items[items.length-1].MONTH ;

function filter() {
//Apk Filter
    let filters = document.getElementById("filters");
    filters.innerHTML = "<form class='_filter'  id='apk_filter' >" +
        "        <div class='div_checklist' >" +
        "            <table id='filter_table' ></table>" +
        "        </div>" +
        "    </form>" ;
    let filter_table = document.getElementById("filter_table");
    var i = 0, count = 0;
    let nb_columns = 12;
    let nb_rows = Math.trunc(ListApplication.length / nb_columns) + 1;
    while (i < nb_rows) {
        let row = filter_table.insertRow(i);
        for (var j = 0; j < nb_columns; j++) {
            let cell = row.insertCell(j);
            if (i === 0 && j === 0) {
                cell.innerHTML = " <label for='uncheck_all'>" +
                    "   <input id='uncheck_all' name='uncheck_all' onclick='reset_filter()'" +
                    "             type='button' value='Uncheck All'>" +
                    "</label> ";
            } else if (i === 0 && j === 1) {
                cell.innerHTML = " <label for='check_all'>" +
                    "   <input id='check_all' name='check_all' onclick='check_all_apk()'" +
                    "         type='button' value='Check All'>" +
                    "</label> ";
            } else {
                try {
                    cell.innerHTML = "<label for='app_" + (count + 1) + "'> " +
                        "            <input id='app_" + (count + 1) + "' name='" + ListApplication[count].APPLICATION_NAME + "' " +
                        "                   type='checkbox' value='" + (count + 1) + "' data-idx='" + (count + 1) + "'" +
                        "onchange='setFilter()' checked>" + ListApplication[count].APPLICATION_NAME +
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

}
filter();

//table
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];
function draw_head(){
    const thead = document.getElementById("thead");
    let head = thead.insertRow(0);
    let cell = head.insertCell(0);
    cell.rowSpan = 2;
    cell.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    for(var mois = 0; mois<last_month; mois ++){
        cell = head.insertCell(mois+1);
        cell.innerText = months[mois];
        cell.colSpan = 3;
    }
    head = thead.insertRow(1);
    for(var mois = 0; mois<last_month; mois ++){
        var obj = head.insertCell(3*mois);
        obj.innerText = "objectif";
        var constate = head.insertCell(3*mois+1);
        constate.innerText = "constaté";
        var ecart = head.insertCell(3*mois+2);
        ecart.innerText = "écart";
    }
}
draw_head()


//////////////////////////////////////////////////////////////////////////


let m1list = [];
let m2list = [];
let m9list = [];

//first sort services
items.forEach(item => {
    if (item.SERVICE === "M1") {
        m1list.push(item);
    } else if (item.SERVICE === "M2") {
        m2list.push(item);
    } else if (item.SERVICE === "M9") {
        m9list.push(item);
    }
})
let mlist = [["M1", m1list], ["M2", m2list], ["M9", m9list]];

//init lists
let filterList = []; // 1 if filter fo apk_i up, else 0
let m_list_imp_apk = [[], [], []];   // imp[a1, ... an] * 12 mois

for (var i = 0; i < ListApplication.length; i++) {
    filterList.push(1);
}
for (var k = 0; k < 3; k++) {
    for (var i = 0; i < last_month; i++) {
        m_list_imp_apk[k].push([]);
        for (var apk = 0; apk < ListApplication.length; apk++) {
            m_list_imp_apk[k][i].push(0);
        }
    }
}

//prepare the table's values
function prepare_values() {
    for (var m = 0; m < mlist.length; m++) {
        for (var mois = 0; mois < last_month; mois++) {
            for (var k = 0; k < ListApplication.length; k++) {
                let imp_k = 0;
                for (var item = 0; item < mlist[m][1].length; item++) {
                    let name_length = mlist[m][1][item].APPLICATION.length;
                    if (mlist[m][1][item].MONTH === mois + 1 &&
                        mlist[m][1][item].APPLICATION === ListApplication[k].APPLICATION_NAME.substr(0, name_length)) {
                        imp_k += mlist[m][1][item].IMPUTATION;
                    }
                }
                m_list_imp_apk[m][mois][k] = imp_k;
            }
        }
    }
}
prepare_values();

var m_list_total_filter_imp = [[], [], []]; //sum imp de chaque mois avec filtre
for (var i = 0; i < last_month; i++) {
    for (var k = 0; k < 3; k++) {
        m_list_total_filter_imp[k].push(0);
    }
}

function calc_tableValues_source() {
    for (var m = 0; m < 3; m++) {
        for (var j = 0; j < last_month; j++) {
            var s = 0;
            for (var k = 0; k < ListApplication.length; k++) {
                s += m_list_imp_apk[m][j][k] * filterList[k];
            }
            m_list_total_filter_imp[m][j] = s;
        }
    }
}
calc_tableValues_source();

//draw and insert into  table
for (var i = 0; i < 3; i++) {
    let row = table.insertRow(i);
    let service = row.insertCell(0);
    service.innerHTML = mlist[i][0];
    for (let j = 0; j < last_month; j++) {
        let num_cell = 3 * j;
        let obj = row.insertCell(num_cell + 1);
        let mois = row.insertCell(num_cell + 2);
        let ecart = row.insertCell(num_cell + 3);
        let text = '';
        text = m_list_total_filter_imp[i][j];

        let objectif_mois = 0;
        if (i === 0) {
            for (var k = 0; k < ListApplication.length; k++) {
                objectif_mois += list_obj[i][k].M1 / 12 * filterList[k];
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M1;
                        vendu = (vendu - 0.037 * vendu) / 393.02  ;
                        if(j+1 >= debut && j+1<= fin){
                            objectif_mois += vendu/(fin-debut+1) * filterList[k];
                        }
                    }
                }
            }
        }
        else if (i === 1) {
            for (var k = 0; k < ListApplication.length; k++) {
                objectif_mois += list_obj[i][k].M2 / 12 * filterList[k];
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M2;
                        vendu = (vendu - 0.037 * vendu) / 393.02  ;
                        if(j+1 >= debut && j+1<= fin){
                            objectif_mois += vendu/(fin-debut+1) * filterList[k];
                        }
                    }
                }
            }
        }
        else if (i === 2) {
            for (var k = 0; k < ListApplication.length; k++) {
                objectif_mois += list_obj[i][k].M9 / 12 * filterList[k];
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M9;
                        vendu = (vendu - 0.037 * vendu) / 393.02  ;
                        if(j+1 >= debut && j+1<= fin){
                            objectif_mois += vendu/(fin-debut+1) * filterList[k];
                        }
                    }
                }
            }
        }

        if (text != 0) mois.innerText = text.toFixed(2);
        else mois.innerText = '';

        if (objectif_mois != 0) obj.innerText = (objectif_mois).toFixed(2);
        else obj.innerText = '';

        var ec = parseFloat(obj.innerText) - text;
        if (objectif_mois + text != 0) ecart.innerText = ec.toFixed(2);
        else ecart.innerText = ''

        if (ec < 0) ecart.style.backgroundColor = "#ffb0b0";
        else if (ec > 0) ecart.style.backgroundColor = "#b3ffb0";
        else ecart.style.backgroundColor = "rgba(255,255,255,0)";
    }
}

//Bar chart
function draw_Chart() {
    var filter_on = 0;
    let m1data, m2data, m9data, vendu_m1 = [], vendu_m2 = [], vendu_m9 = [];
    for (var k = 0; k < filterList.length; k++) {
        filter_on += filterList[k];
    }
    m1data = m_list_total_filter_imp[0];
    m2data = m_list_total_filter_imp[1];
    m9data = m_list_total_filter_imp[2];

    
    for (var j = 0; j < last_month; j++) {
        let tot_m1 = 0, tot_m2 = 0, tot_m9 = 0;

        for (var k = 0; k < ListApplication.length; k++) {
            tot_m1 += commande_vendu_m1[k].M1 / 12 * filterList[k];
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu = listAvenant[av].M1;
                    vendu = (vendu - 0.037 * vendu) / 393.02  ;
                    if(j+1 >= debut && j+1<= fin){
                        tot_m1 += vendu/(fin-debut+1) * filterList[k];
                    }
                }
            }
        }
        vendu_m1.push(tot_m1);

        for (var k = 0; k < ListApplication.length; k++) {
            tot_m2 += commande_vendu_m2[k].M2 / 12 * filterList[k];
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu = listAvenant[av].M2;
                    vendu = (vendu - 0.037 * vendu) / 393.02  ;
                    if(j+1 >= debut && j+1<= fin){
                        tot_m2 += vendu/(fin-debut+1) * filterList[k];
                    }
                }
            }
        }
        vendu_m2.push(tot_m2);

        for (var k = 0; k < ListApplication.length; k++) {
            tot_m9 += commande_vendu_m9[k].M9 / 12 * filterList[k];
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu = listAvenant[av].M9;
                    vendu = (vendu - 0.037 * vendu) / 393.02  ;
                    if(j+1 >= debut && j+1<= fin){
                        tot_m9 += vendu/(fin-debut+1) * filterList[k];
                    }
                }
            }
        }
        vendu_m9.push(tot_m9);
    }

    const labels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    const data = {
        labels: labels,
        datasets: [
            {
                type: 'bar',
                label: 'M1',
                data: m1data,
                borderColor: "red",
                backgroundColor: "red",
                order: 1,
            },
            {
                type: 'line',
                label: 'Objectif M1',
                data: vendu_m1,
                borderColor: "#a50000",
                order: 0,
                borderDash: [10, 5],
                borderWidth: 2,
                backgroundColor: "rgba(255,255,255,0)",

            },
            {
                type: 'bar',
                label: 'M2',
                data: m2data,
                borderColor: "blue",
                backgroundColor: "blue",
                order: 1,

            },
            {
                type: 'line',
                label: 'Objectif M2',
                data: vendu_m2,
                borderColor: "#002b96",
                order: 0,
                borderDash: [10, 5],
                borderWidth: 2,
                backgroundColor: "rgba(255,255,255,0)"

            },
            {
                type: 'bar',
                label: 'M9',
                data: m9data,
                borderColor: "orange",
                backgroundColor: "orange",
                order: 1,
            },
            {
                type: 'line',
                label: 'Objectif M9',
                data: vendu_m9,
                borderColor: "#653501",
                order: 0,
                borderDash: [10, 5],
                borderWidth: 2,
                backgroundColor: "rgba(255,255,255,0)"
            },
        ]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
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
                    text: 'Service per month Chart'
                }
            },
        },
    };

    first_chart = new Chart("myChart", config);
}

draw_Chart();


////////// set filter

function update_table() {
    for (var i = 0; i < 3; i++) {
        let row = table.rows[i];

        for (let j = 0; j < last_month; j++) {
            let num_cell = 3 * j;
            let obj = row.cells[num_cell + 1];
            let mois = row.cells[num_cell + 2];
            let ecart = row.cells[num_cell + 3];
            let text = '';

            text = m_list_total_filter_imp[i][j];

            let objectif_mois = 0;
            if (i === 0) {
                for (var k = 0; k < ListApplication.length; k++) {
                    objectif_mois += list_obj[i][k].M1 / 12 * filterList[k];
                    for (var av = 0; av < listAvenant.length; av++) {
                        if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                            var debut = listAvenant[av].DEBUT;
                            var fin = listAvenant[av].FIN;
                            var vendu = listAvenant[av].M1;
                            vendu = (vendu - 0.037 * vendu) / 393.02  ;
                            if(j+1 >= debut && j+1<= fin){
                                objectif_mois += vendu/(fin-debut+1) * filterList[k];
                            }
                        }
                    }
                }
            } else if (i === 1) {
                for (var k = 0; k < ListApplication.length; k++) {
                    objectif_mois += list_obj[i][k].M2 / 12 * filterList[k];
                    for (var av = 0; av < listAvenant.length; av++) {
                        if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                            var debut = listAvenant[av].DEBUT;
                            var fin = listAvenant[av].FIN;
                            var vendu = listAvenant[av].M2;
                            vendu = (vendu - 0.037 * vendu) / 393.02  ;
                            if(j+1 >= debut && j+1<= fin){
                                objectif_mois += vendu/(fin-debut+1) * filterList[k];
                            }
                        }
                    }
                }
            } else if (i === 2) {
                for (var k = 0; k < ListApplication.length; k++) {
                    objectif_mois += list_obj[i][k].M9 / 12 * filterList[k];
                    for (var av = 0; av < listAvenant.length; av++) {
                        if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                            var debut = listAvenant[av].DEBUT;
                            var fin = listAvenant[av].FIN;
                            var vendu = listAvenant[av].M9;
                            vendu = (vendu - 0.037 * vendu) / 393.02  ;
                            if(j+1 >= debut && j+1<= fin){
                                objectif_mois += vendu/(fin-debut+1) * filterList[k];
                            }
                        }
                    }
                }
            }

            if (text != 0) mois.innerText = text.toFixed(2);
            else {
                mois.innerText = '';
            }

            if (objectif_mois != 0) obj.innerText = (objectif_mois).toFixed(2);
            else obj.innerText = '';

            var ec = parseFloat(obj.innerText) - text;
            if (text != 0 || objectif_mois != 0) ecart.innerText = ec.toFixed(2);
            else ecart.innerText = ''

            if (ec < 0) ecart.style.backgroundColor = "#ffb0b0";
            else if (ec > 0) ecart.style.backgroundColor = "#b3ffb0";
            else ecart.style.backgroundColor = "rgba(255,255,255,0)";
        }
    }
}
function update_chart() {
    first_chart.destroy();
    draw_Chart();
}
function re_init_filter_list() {
    for (var i = 0; i < ListApplication.length; i++) {
        filterList[i] = 0;
    }
}
function check_all_filter_list() {
    for (var i = 0; i < ListApplication.length; i++) {
        filterList[i] = 1;
    }
}
function setFilter() {
    re_init_filter_list();
    //console.log("inside filter function.");
    for (var a = 0; a < ListApplication.length; a++) {
        var id_k = 'app_' + (a + 1);
        var apk = document.getElementById(id_k);
        if (apk.checked) {
            filterList[a] = 1;
        }

    }
    calc_tableValues_source();
    update_table();
    update_chart();
}

function reset_filter() {
    for (var a = 0; a < ListApplication.length; a++) {
        var id_k = 'app_' + (a + 1);
        var apk = document.getElementById(id_k);
        apk.checked = false;
    }
    re_init_filter_list();
    calc_tableValues_source();
    update_table();
    update_chart();
    console.log("filter reset");
}

function check_all_apk() {
    for (var a = 0; a < ListApplication.length; a++) {
        var id_k = 'app_' + (a + 1);
        var apk = document.getElementById(id_k);
        apk.checked = true;
    }
    check_all_filter_list();
    calc_tableValues_source();
    update_table();
    update_chart();
    console.log("filter apk checked all");
}


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
}   */

var error = document.getElementById("error");
if (objList.length !== ListApplication.length || objList.length !== commande_vendu_m1.length) {
    error.innerHTML = "Veuillez vérifier si les noms des applications dans la table des commandes et dans la table des imputations sont les mêmes";
    error.style.color = "#ba0000"
} else {
    error.innerHTML = "";
}

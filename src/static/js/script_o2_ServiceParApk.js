var list1 = document.getElementById('listServiceParApkMois').innerText;
var list2 = document.getElementById('ListApplication').innerText;
var obj1 = document.getElementById('commande_vendu_m1').innerText;
var obj2 = document.getElementById('commande_vendu_m2').innerText;
var obj9 = document.getElementById('commande_vendu_m9').innerText;
var av = document.getElementById('listAvenant').innerText;

var commande_vendu_m1 = JSON.parse(obj1);
var commande_vendu_m2 = JSON.parse(obj2);
var commande_vendu_m9 = JSON.parse(obj9);

let items = JSON.parse(list1);    //listServiceParApkMois
var ListApplication = JSON.parse(list2)
var listAvenant = JSON.parse(av) ;

let last_month = items[items.length-1].MONTH;
let list_obj = [commande_vendu_m1, commande_vendu_m2, commande_vendu_m9];
const table = document.getElementById("table_service_par_apk");
const table_head = document.getElementById("head_service_par_apk");



//month filter
let monthsList = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet',
    'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

let monthLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
    'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

let text = [];
for (var mois = 0; mois < last_month; mois++) {
    text[mois] = "<label for='" + (mois + 1) + "'> " +
        "            <input id='" + (mois + 1) + "' class='mois' onchange='setMonthFilter()'" +
        " name='" + monthsList[mois] + "'  type='checkbox' value='" + (mois + 1) + "' " +
        "data-idx='" + (mois + 1) + "' checked >" + monthLabels[mois] +
        "  </label> <br>";
    document.getElementById("month_filter").innerHTML += text[mois];
}

//sort data

let m1list = [];
let m2list = [];
let m9list = [];

items.forEach(item => {
    if (item.SERVICE === 'M1') {
        m1list.push(item);
    } else if (item.SERVICE === 'M2') {
        m2list.push(item);
    } else if (item.SERVICE === 'M9') {
        m9list.push(item);
    }
})
let mlist = [['M1', m1list], ['M2', m2list], ['M9', m9list]];

//init lists
let month_filterList = []; // 1 if apk filter fo apk_i up, else 0
for(var i=0; i<last_month; i++){
    month_filterList.push(1);
}
let m_list_imp_apk = [[], [], []];   // imp[a1, ... an] * 12

for (var k = 0; k < 3; k++) {
    for (var i = 0; i < ListApplication.length; i++) {
        m_list_imp_apk[k].push([]);
        for (var m = 0; m < last_month.length; m++) {
            m_list_imp_apk[k][i].push(0);
        }
    }
}

//prepare the table's values
for (var m = 0; m < mlist.length; m++) {
    for (var apk = 0; apk < ListApplication.length; apk++) {
        for (var k = 0; k < last_month; k++) {
            var imp_k = 0;
            for (var item = 0; item < mlist[m][1].length; item++) {
                if (mlist[m][1][item].MONTH === k + 1 &&
                    mlist[m][1][item].APPLICATION === ListApplication[apk].APPLICATION_NAME) {
                    imp_k += mlist[m][1][item].IMPUTATION;
                }
            }
            m_list_imp_apk[m][apk][k] = imp_k;
        }
    }
}

var m_list_total_filter_imp = [[], [], []]; //sum imp de chaque apk avec filtre
for (var i = 0; i < ListApplication.length; i++) {
    for (var k = 0; k < 3; k++) {
        m_list_total_filter_imp[k].push(0);
    }
}

function calc_tableValues_source() {
    for (var m = 0; m < 3; m++) {
        for (var j = 0; j < ListApplication.length; j++) {
            var s = 0;
            for (var k = 0; k < last_month; k++) {
                s += m_list_imp_apk[m][j][k] * month_filterList[k];
            }
            m_list_total_filter_imp[m][j] = s;
        }
    }
}
calc_tableValues_source();


//insert head of table
let head = table_head.insertRow(0)
head.insertCell(0);
for (let j = 0; j < mlist.length; j++) {
    let serviceName = head.insertCell(j + 1);
    serviceName.colSpan = "3";
    serviceName.innerText = mlist[j][0];
}
//insert head attr of table
let attr = table_head.insertRow(1)
attr.insertCell(0);
for (let j = 0; j < mlist.length; j++) {
        let num_cell = 3 * j;
        let obj = attr.insertCell(num_cell + 1);
        let apk = attr.insertCell(num_cell + 2);
        let ecart = attr.insertCell(num_cell + 3);
        obj.innerText = "objectif";
        apk.innerText = "constaté";
        ecart.innerText = "écart";
    }

//now insert in table

for (i = 0; i < ListApplication.length; i++) {
    let row = table.insertRow(i);
    let appName = row.insertCell(0);
    appName.innerHTML = ListApplication[i].APPLICATION_NAME;
    for (let j = 0; j < mlist.length; j++) {
        let num_cell = 3 * j;
        let obj = row.insertCell(num_cell + 1);
        let apk = row.insertCell(num_cell + 2);
        let ecart = row.insertCell(num_cell + 3);
        let filter_on = 0;
        for (var k = 0; k < last_month; k++) {
            filter_on += month_filterList[k];
        }
        let text = '';
        text = m_list_total_filter_imp[j][i];

        let objectif_mois = 0;
        if (j === 0) {
            objectif_mois = list_obj[j][i].M1 / 12 * filter_on;
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu = listAvenant[av].M1;
                    vendu = (vendu - 0.037 * vendu) / 393.02 ;
                    for(var mois=0; mois<last_month; mois++){
                        if(mois+1 >= debut && mois+1<= fin)
                        {
                            objectif_mois += vendu/(fin-debut+1) * month_filterList[mois];
                        }
                    }
                }
            }
        }
        else if (j === 1) {
            objectif_mois = list_obj[j][i].M2 / 12 * filter_on;
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu = listAvenant[av].M2;
                    vendu = (vendu - 0.037 * vendu) / 393.02 ;
                    for(var mois=0; mois<last_month; mois++){
                        if(mois+1 >= debut && mois+1<= fin)
                        {
                            objectif_mois += vendu/(fin-debut+1) * month_filterList[mois];
                        }
                    }
                }
            }
        }
        else if (j === 2) {
            objectif_mois = list_obj[j][i].M9 / 12 * filter_on;
            for (var av = 0; av < listAvenant.length; av++) {
                if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                    var debut = listAvenant[av].DEBUT;
                    var fin = listAvenant[av].FIN;
                    var vendu = listAvenant[av].M9;
                    vendu = (vendu - 0.037 * vendu) / 393.02 ;
                    for(var mois=0; mois<last_month; mois++){
                        if(mois+1 >= debut && mois+1<= fin)
                        {
                            objectif_mois += vendu/(fin-debut+1) * month_filterList[mois];
                        }
                    }
                }
            }
        }

        if (text != 0) apk.innerText = text.toFixed(2);
        else apk.innerText = '';

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
function mark_empty() {
    for (var i = 0; i < ListApplication.length; i++) {
        let row = table.rows[i];
        let empty = true;
        for (var cell = 1; cell < 10; cell++) {
            if (row.cells[cell].innerText !== "") {
                empty = false;
                break
            }
        }
        if (empty === true) {
            row.style.background = "#ababab";
        } else {
            row.style.background = "none";
        }
    }
}
mark_empty();


    //bar chart

let colors = [
    "#000344", "#ff0000", "#ffe300", "#6356ff",
    "#b2c3f4", "#e34f78", "#00eeff", "#00ff4c",
    "#006a3a", "#06d671", "#00ff73", "#5fcb91",
    "#446300", "#edfe00", "#bec24e", "#fffa90",
    "#7b4900", "#d87402", "#ff9a3a", "#ffb682",
    "#85ff93", "#002a3e", "#acf400", "#962f3d",
];

var chart;
function draw_Chart() {
    //which data to use
    let filter_on = 0;
    for (var k = 0; k < month_filterList.length; k++) {
        filter_on += month_filterList[k];
    }

    let vendu_m1 = [], vendu_m2 = [], vendu_m9 = [];
    let tot_m1 = 0;
    for (var k = 0; k < commande_vendu_m1.length; k++) {
        tot_m1 = commande_vendu_m1[k].M1 / 12 * filter_on;
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M1;
                vendu = (vendu - 0.037 * vendu) / 393.02 ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        tot_m1 += vendu/(fin-debut+1) * month_filterList[mois];
                    }
                }
            }
        }
        vendu_m1.push(tot_m1);
    }

    let tot_m2 = 0;
    for (var k = 0; k < commande_vendu_m2.length; k++) {
        tot_m2 = commande_vendu_m2[k].M2 / 12 * filter_on;
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M2;
                vendu = (vendu - 0.037 * vendu) / 393.02 ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        tot_m2 += vendu/(fin-debut+1) * month_filterList[mois];
                    }
                }
            }
        }
        vendu_m2.push(tot_m2);
    }
    let tot_m9 = 0;
    for (var k = 0; k < commande_vendu_m9.length; k++) {
        tot_m9 = commande_vendu_m9[k].M9 / 12 * filter_on;
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M9;
                vendu = (vendu - 0.037 * vendu) / 393.02 ;
                for(var mois=0; mois<last_month; mois++){
                    if(mois+1 >= debut && mois+1<= fin)
                    {
                        tot_m9 += vendu/(fin-debut+1) * month_filterList[mois];
                    }
                }
            }
        }
        vendu_m9.push(tot_m9);
    }


    var mdata = [m_list_total_filter_imp[0], m_list_total_filter_imp[1], m_list_total_filter_imp[2]];
    var services = ['M1', 'M2', 'M9'];
    const labels = [];
    for (var i = 0; i < ListApplication.length; i++) {
        labels.push(ListApplication[i].APPLICATION_NAME);
    }

    // define datasets
    let dataset = []
    for (var i = 0; i < 3; i++) {
        var set = {
            type: 'bar',
            label: services[i],
            data: mdata[i],
            borderColor: colors[i + 1],
            backgroundColor: colors[i + 1],
            order: 1
        };
        dataset.push(set);
    }
    
    var obj_set1 = {
        type: 'line',
        label: 'Objectif M1',
        data: vendu_m1,
        borderColor: "#a50000",
        order: 0,
        borderDash: [10, 5],
        borderWidth: 2,
        backgroundColor: "rgba(255,255,255,0)",
    };
    dataset.push(obj_set1);

    var obj_set2 = {
        type: 'line',
        label: 'Objectif M2',
        data: vendu_m2,
        borderColor: "#001478",
        order: 0,
        borderDash: [10, 5],
        borderWidth: 2,
        backgroundColor: "rgba(255,255,255,0)",
    };
    dataset.push(obj_set2);

    var obj_set9 = {
        type: 'line',
        label: 'Objectif M9',
        data: vendu_m9,
        borderColor: "#725101",
        order: 0,
        borderDash: [10, 5],
        borderWidth: 2,
        backgroundColor: "rgba(255,255,255,0)",
    };
    dataset.push(obj_set9);


    const data = {
        labels: labels,
        datasets: dataset
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
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
    chart = new Chart("o2_myChart", config);
}
draw_Chart();


////////// set filter

function update_table() {
    for (i = 0; i < ListApplication.length; i++) {
        let row = table.rows[i];
        for (let j = 0; j < mlist.length; j++) {
            let numcell = j * 3;
            let obj = row.cells[numcell + 1];
            let apk = row.cells[numcell + 2];
            let ecart = row.cells[numcell + 3];
            let filter_on = 0;
            for (var k = 0; k < month_filterList.length; k++) {
                filter_on += month_filterList[k];
            }
            let text ='';

            text = m_list_total_filter_imp[j][i];

            let objectif_mois = 0;
            if (j === 0) {
                objectif_mois = list_obj[j][i].M1 / 12 * filter_on;
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M1;
                        vendu = (vendu - 0.037 * vendu) / 393.02 ;
                        for(var mois=0; mois<last_month; mois++){
                            if(mois+1 >= debut && mois+1<= fin)
                            {
                                objectif_mois += vendu/(fin-debut+1) * month_filterList[mois];
                            }
                        }
                    }
                }
            } else if (j === 1) {
                objectif_mois = list_obj[j][i].M2 / 12 * filter_on;
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M2;
                        vendu = (vendu - 0.037 * vendu) / 393.02 ;
                        for(var mois=0; mois<last_month; mois++){
                            if(mois+1 >= debut && mois+1<= fin)
                            {
                                objectif_mois += vendu/(fin-debut+1) * month_filterList[mois];
                            }
                        }
                    }
                }
            } else if (j === 2) {
                objectif_mois = list_obj[j][i].M9 / 12 * filter_on;
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M9;
                        vendu = (vendu - 0.037 * vendu) / 393.02 ;
                        for(var mois=0; mois<last_month; mois++){
                            if(mois+1 >= debut && mois+1<= fin)
                            {
                                objectif_mois += vendu/(fin-debut+1) * month_filterList[mois];
                            }
                        }
                    }
                }
            }

            if (text != 0)
                apk.innerText = text.toFixed(2);
            else
                apk.innerText = '';

            if (objectif_mois !== 0)
                obj.innerText = (objectif_mois).toFixed(2);
            else
                obj.innerText = '';

            var ec = parseFloat(obj.innerText) - text;
            if (text + objectif_mois != 0) ecart.innerText = ec.toFixed(2);
            else ecart.innerText = ''

            if (ec < 0) ecart.style.backgroundColor = "#ffb0b0";
            else if (ec > 0) ecart.style.backgroundColor = "#b3ffb0";
            else ecart.style.backgroundColor = "rgba(255,255,255,0)";
        }
    }

    mark_empty();
}

function update_chart() {
    chart.destroy();
    draw_Chart();
}
function re_init_filterlist() {
    for (var i = 0; i < month_filterList.length; i++) {
        month_filterList[i] = 0;
    }
}
function check_all_filter_list() {
    for (var i = 0; i < month_filterList.length; i++) {
        month_filterList[i] = 1;
    }
}
function setMonthFilter() {
    re_init_filterlist();
    for (var i = 0; i < month_filterList.length; i++) {
        var id_k = (i + 1).toString();
        var mois = document.getElementById(id_k);
        if (mois.checked) {
            month_filterList[i] = 1;
        }
    }
    calc_tableValues_source();
    update_table();
    update_chart();
}
function reset_filter() {
    for (var i = 0; i < month_filterList.length; i++) {
        var id_k = (i + 1).toString();
        var mois = document.getElementById(id_k);
        mois.checked = false;
    }
    re_init_filterlist();
    calc_tableValues_source();
    update_table();
    update_chart();

    console.log("filter reset");
}
function check_all_months() {
        for (var i = 0; i < month_filterList.length; i++) {
            var id_k = (i + 1).toString();
            var mois = document.getElementById(id_k);
            mois.checked = true;
        }
        check_all_filter_list();
        calc_tableValues_source();
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

if(objList.length !== ListApplication.length || objList.length !== commande_vendu_m1.length){
    error.innerHTML= "Veuillez vérifier si les noms des applications dans la table des commandes" +
        +'<br/>'+"et dans la table des imputations sont les mêmes";
    error.style.color = "#ba0000"
}
else{
    error.innerHTML="";
}
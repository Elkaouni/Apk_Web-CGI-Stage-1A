// noinspection JSDuplicatedDeclaration

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

let m1list = [];
let m2list = [];
let m9list = [];

//first sort servcies
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

const table = document.getElementById("table_service_par_apk");
const table_head = document.getElementById("head_service_par_apk");

function draw_table(){
    //insert head of table
    let head = table_head.insertRow(0);
    let cell = head.insertCell(0);
    cell.rowSpan = 3;

    cell = head.insertCell(1);
    cell.colSpan = 9;
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
    for (let j = 0; j < mlist.length; j++) {
        let serviceName = head.insertCell(j);
        serviceName.colSpan = "3";
        serviceName.innerText = mlist[j][0];
    }
//insert head attr of table
    let attr = table_head.insertRow(2)
    for (let j = 0; j < mlist.length; j++) {
        let num_cell = 3 * j;
        let obj = attr.insertCell(num_cell );
        let apk = attr.insertCell(num_cell + 1);
        let ecart = attr.insertCell(num_cell + 2);
        obj.innerText = "objectif";
        apk.innerText = "constaté";
        ecart.innerText = "écart";
    }

//now insert in table

    for (var i = 0; i < ListApplication.length; i++) {
        let row = table.insertRow(i);
        let appName = row.insertCell(0);
        appName.innerHTML = ListApplication[i].APPLICATION_NAME;
        for (let j = 0; j < mlist.length; j++) {
            let num_cell = 3 * j;
            let obj = row.insertCell(num_cell + 1);
            let apk = row.insertCell(num_cell + 2);
            let ecart = row.insertCell(num_cell + 3);
            let text = 0;
            let objectif_mois = 0;
            if (j === 0) {
                objectif_mois = list_obj[j][i].M1 / c_nbWeek;

            } else if (j === 1) {
                objectif_mois = list_obj[j][i].M2 / c_nbWeek;

            } else if (j === 2) {
                objectif_mois = list_obj[j][i].M9 / c_nbWeek;
            }

            if (text !== 0) apk.innerText = text;
            else {
                apk.innerText = '';
            }

            if (objectif_mois !== 0 && user_weeks !=="")
                obj.innerText = (objectif_mois).toFixed(2);
            else {
                obj.innerText = '';
            }

            var ec = parseFloat(obj.innerText) - text;
            if (objectif_mois + text !== 0 && user_weeks !=="") ecart.innerText = ec.toFixed(2);
            else ecart.innerText = ''

            if (ec < 0) ecart.style.backgroundColor = "#ffb0b0";
            else if (ec > 0) ecart.style.backgroundColor = "#b3ffb0";
            else ecart.style.backgroundColor = "#ababab";
        }
    }
}
draw_table();

//seperate each week's data
let mlist_week=[[],[],[]]
for(var k=0; k<3; k++) {
    for(var apk=0; apk<ListApplication.length; apk++){
        mlist_week[k].push([]);
        for(var w=0; w<53; w++){
            mlist_week[k][apk].push(0)
        }
    }
}
//prepare the table's values
for (var m = 0; m < mlist.length; m++) {
    for (var apk = 0; apk < ListApplication.length; apk++) {
        for (var item = 0; item < mlist[m][1].length; item++) {
            var jour = mlist[m][1][item].DAY;
            var mois = mlist[m][1][item].MONTH -1;
            var year = mlist[m][1][item].YEAR;
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
            //let name_length = mlist[m][1][item].APPLICATION.length;
            if (mlist[m][1][item].APPLICATION === ListApplication[apk].APPLICATION_NAME) {
                mlist_week[m][apk][week-1] += mlist[m][1][item].IMPUTATION ;
            }
        }
    }
}

var m_list_total_filter_imp = [[], [], []]; //sum imp de chaque apk avec filtre
for (var k = 0; k < 3; k++) {
    for (w = 0; w < 53; w++){
        m_list_total_filter_imp[k].push([]);
        for (var i = 0; i < ListApplication.length; i++){
            m_list_total_filter_imp[k][w].push(0);
        }
    }
}

function calc_tableValues_source() {
    for (var m = 0; m < 3; m++) {
        for (var j = 0; j < ListApplication.length; j++) {
            for (var w = 0; w < 53; w++) {
                m_list_total_filter_imp[m][w][j] += mlist_week[m][j][w];
            }
        }
    }
}
calc_tableValues_source();


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
    var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
    var leapYear = new Date(YEAR, 1, 29);
    if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
        monthLength[1] = 29;
    }

    var selectedWeek = 0;
    if(user_weeks !== ""){
        var spotWeek = user_weeks.indexOf("W");
        var week = parseInt(user_weeks.substr(spotWeek + 1));
        selectedWeek = week;
    }
    var weekData = selectedWeek-1;

    let vendu_m1 = [], vendu_m2 = [], vendu_m9 = [];
    let tot_m1 = 0;
    for (var k = 0; k < commande_vendu_m1.length; k++) {
        tot_m1 = commande_vendu_m1[k].M1 / c_nbWeek;
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M1;
                var debutDate = new Date(YEAR, debut-1, 1)
                var finDate = new Date(YEAR, fin-1, monthLength[fin-1])
                var debutWeek = debutDate.getWeek();
                var finWeek = finDate.getWeek();

                vendu = (vendu - 0.037 * vendu) / 393.02 ;

                if(weekData+1 >= debutWeek && weekData+1<= finWeek){
                    var nb_jour = 0;
                    for(var l=debut-1; l<fin; l++){
                        nb_jour += monthLength[l]
                    }
                    tot_m1 += (vendu/nb_jour * 7);
                }
            }
        }

        vendu_m1.push(tot_m1);
    }
    let tot_m2 = 0;
    for (var k = 0; k < commande_vendu_m2.length; k++) {
        tot_m2 = commande_vendu_m2[k].M2 / c_nbWeek;
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M2;
                var debutDate = new Date(YEAR, debut-1, 1)
                var finDate = new Date(YEAR, fin-1, monthLength[fin-1])
                var debutWeek = debutDate.getWeek();
                var finWeek = finDate.getWeek();

                vendu = (vendu - 0.037 * vendu) / 393.02 ;

                if(weekData+1 >= debutWeek && weekData+1<= finWeek){
                    var nb_jour = 0;
                    for(var l=debut-1; l<fin; l++){
                        nb_jour += monthLength[l]
                    }
                    tot_m2 += (vendu/nb_jour * 7);
                }
            }
        }

        vendu_m2.push(tot_m2);
    }
    let tot_m9 = 0;
    for (var k = 0; k < commande_vendu_m9.length; k++) {
        tot_m9 = commande_vendu_m9[k].M9 / c_nbWeek;
        for (var av = 0; av < listAvenant.length; av++) {
            if(listAvenant[av].APPLICATIONS === ListApplication[k].APPLICATION_NAME){
                var debut = listAvenant[av].DEBUT;
                var fin = listAvenant[av].FIN;
                var vendu = listAvenant[av].M9;
                var debutDate = new Date(YEAR, debut-1, 1)
                var finDate = new Date(YEAR, fin-1, monthLength[fin-1])
                var debutWeek = debutDate.getWeek();
                var finWeek = finDate.getWeek();

                vendu = (vendu - 0.037 * vendu) / 393.02 ;

                if(weekData+1 >= debutWeek && weekData+1<= finWeek){
                    var nb_jour = 0;
                    for(var l=debut-1; l<fin; l++){
                        nb_jour += monthLength[l]
                    }
                    tot_m9 += (vendu/nb_jour * 7);
                }
            }
        }

        vendu_m9.push(tot_m9);
    }

    let m1data = [], m2data = [], m9data = [];

    if(weekData !== -1){
        m1data = m_list_total_filter_imp[0][weekData]
        m2data = m_list_total_filter_imp[1][weekData]
        m9data = m_list_total_filter_imp[2][weekData]
    }

    var mdata = [m1data, m2data, m9data]

    var services = ['M1', 'M2', 'M9'];
    const labels = [];
    for (var i = 0; i < ListApplication.length; i++) {
        labels.push(ListApplication[i].APPLICATION_NAME);
    }

    // define datasets
    let dataset = []
    for (var i = 0; i < mdata.length; i++) {
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

    for (var i = 0; i < ListApplication.length; i++) {
        let row = table.rows[i];
        for (let j = 0; j < 3; j++) {
            let numcell = j * 3;
            let obj = row.cells[numcell + 1];
            let apk = row.cells[numcell + 2];
            let ecart = row.cells[numcell + 3];
            let text;
            let weekNum = selectedWeek-1;
            if(weekNum === -1){
                text = 0;
            }
            else
                text = m_list_total_filter_imp[j][weekNum][i];

            let objectif_mois = 0;
            
            if (j === 0) {
                objectif_mois = commande_vendu_m1[i].M1 / c_nbWeek;
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M1;
                        var debutDate = new Date(YEAR, debut-1, 1)
                        var finDate = new Date(YEAR, fin-1, monthLength[fin-1])
                        var debutWeek = debutDate.getWeek();
                        var finWeek = finDate.getWeek();

                        vendu = (vendu - 0.037 * vendu) / 393.02 ;

                        if(weekNum+1 >= debutWeek && weekNum+1<= finWeek){
                            var nb_jour = 0;
                            for(var l=debut-1; l<fin; l++){
                                nb_jour += monthLength[l]
                            }
                           objectif_mois += (vendu/nb_jour * 7);
                        }
                    }
                }
            }
            else if (j === 1) {
                objectif_mois = list_obj[j][i].M2 / c_nbWeek;
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M2;
                        var debutDate = new Date(YEAR, debut-1, 1)
                        var finDate = new Date(YEAR, fin-1, monthLength[fin-1])
                        var debutWeek = debutDate.getWeek();
                        var finWeek = finDate.getWeek();

                        vendu = (vendu - 0.037 * vendu) / 393.02 ;

                        if(weekNum+1 >= debutWeek && weekNum+1<= finWeek){
                            var nb_jour = 0;
                            for(var l=debut-1; l<fin; l++){
                                nb_jour += monthLength[l]
                            }
                            objectif_mois += (vendu/nb_jour * 7);
                        }
                    }
                }
            }
            else if (j === 2) {
                objectif_mois = list_obj[j][i].M9 / c_nbWeek;
                for (var av = 0; av < listAvenant.length; av++) {
                    if(listAvenant[av].APPLICATIONS === ListApplication[i].APPLICATION_NAME){
                        var debut = listAvenant[av].DEBUT;
                        var fin = listAvenant[av].FIN;
                        var vendu = listAvenant[av].M9;
                        var debutDate = new Date(YEAR, debut-1, 1)
                        var finDate = new Date(YEAR, fin-1, monthLength[fin-1])
                        var debutWeek = debutDate.getWeek();
                        var finWeek = finDate.getWeek();

                        vendu = (vendu - 0.037 * vendu) / 393.02 ;

                        if(weekNum+1 >= debutWeek && weekNum+1<= finWeek){
                            var nb_jour = 0;
                            for(var l=debut-1; l<fin; l++){
                                nb_jour += monthLength[l]
                            }
                            objectif_mois += (vendu/nb_jour * 7);
                        }
                    }
                }
            }

            if (text != 0) {
                apk.innerText = text.toFixed(2);
                apk.style.backgroundColor = "none";
            }
            else {
                apk.innerText = '';
                apk.style.background = "#ababab";
            }

            if (objectif_mois !== 0 && weekNum !== -1) {
                obj.innerText = (objectif_mois).toFixed(2);
                obj.style.backgroundColor = "none";
            }
            else {
                obj.innerText = '';
                obj.style.background = "#ababab";
            }

            var ec = parseFloat(obj.innerText) - text;
            if (text + objectif_mois !== 0) ecart.innerText = ec.toFixed(2);
            else ecart.innerText = ''

            if (ec < 0) ecart.style.backgroundColor = "#ffb0b0";
            else if (ec > 0) ecart.style.backgroundColor = "#b3ffb0";
            else ecart.style.backgroundColor = "#ababab";
        }
    }
}
function update_chart() {
    chart.destroy();
    draw_Chart();
}


function confirmWeeks(){
    var id= "s1";
    user_weeks = document.getElementById(id).value;
    calc_tableValues_source();
    update_table();
    update_chart();
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
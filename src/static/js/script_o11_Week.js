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
let user_weeks=["","","","",""];
const c_nbWeek = 52;
const YEAR = items[0].YEAR ;

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
                        " onchange='setFilter()' checked>" + ListApplication[count].APPLICATION_NAME +
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

////////////////////////////////////////////////////////////////
const thead = document.getElementById("thead");
const tbody = document.getElementById('table_service_par_mois')
function drawTable(){
    let row = thead.insertRow(0);
    let cell = row.insertCell(0);
    cell.rowSpan = 3;
    cell.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    cell = row.insertCell(1);
    cell.colSpan = 5*3;
    cell.innerText=  "Choisir les semaines souhaitées"  ;

    row = thead.insertRow(1);

    for(var i=0; i<5; i++){
        var id = "s"+(i+1);
        cell = row.insertCell(i);
        cell.innerHTML= "<label for='week'></label>" +
            "<input id='"+ id +"' type='week' name='week' >" +
            "<span class='validity'></span>" ;
        cell.colSpan = 3;
        cell.name = "s"+(i+1);
    }

    row = thead.insertRow(2);

    for(var j=0; j<5; j++){
        cell = row.insertCell(3*j);
        cell.innerText = "Objectif"
        cell = row.insertCell(3*j+1);
        cell.innerText = "Constaté"
        cell = row.insertCell(3*j+2);
        cell.innerText = "écart"
    }

    for(var j=0; j<3; j++){
        row = tbody.insertRow(j);
        cell = row.insertCell(0);
        cell.innerText= "M"+ (j+1)  ;
        for(var i=0; i<5; i++){
            cell = row.insertCell(3*i+1);
            cell.innerText = "";
            cell.style.background = "none";
            cell = row.insertCell(3*i+2);
            cell.innerText = "";
            cell.style.background = "none";
            cell = row.insertCell(3*i+3);
            cell.innerText = "";
            cell.style.background = "none";
        }
    }
}
drawTable();

    

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

let filterList = []; // 1 if filter fo apk_i up, else 0
for (var i = 0; i < ListApplication.length; i++) {
    filterList.push(1);
}

//seperate each week's data
let mlist_week=[[],[],[]]
for(var k=0; k<3; k++) {
    for(var w=0; w<53; w++){
        mlist_week[k].push([]);
        for(var apk=0; apk<ListApplication.length; apk++){
            mlist_week[k][w].push(0)
        }
    }
}

//prepare the table's values
function prepare_values() {
    for (var m = 0; m < 3; m++) {
        for (var k = 0; k < ListApplication.length; k++) {
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
                if (mlist[m][1][item].APPLICATION === ListApplication[k].APPLICATION_NAME) {
                    mlist_week[m][week-1][k] += mlist[m][1][item].IMPUTATION ;
                }
            }
        }
    }
}
prepare_values();


var m_list_total_filter_imp = [[], [], []]; //sum imp de chaque semaine avec filtre
for (var k = 0; k < 3; k++){
    for (var i = 0; i < 53; i++) {
        m_list_total_filter_imp[k].push(0);
    }
}      

function calc_tableValues_source() {
    for (var m = 0; m < 3; m++) {
        for (var w = 0; w < 53; w++) {
           var s = 0;
           for (var k = 0; k < ListApplication.length; k++) {
               s += mlist_week[m][w][k] * filterList[k];
           }
           m_list_total_filter_imp[m][w] = s;
       }
   }
}
calc_tableValues_source();

//Bar chart
function draw_Chart() {
    console.log("i m drawing")
    let m1data = [], m2data = [], m9data = [];
    let vendu_m1 = [], vendu_m2 = [], vendu_m9 = [];
    const labels = user_weeks;
    var selectedWeeks = [0,0,0,0,0];
    for(var w = 0; w<5; w++){
        if(user_weeks[w]=== "")
            selectedWeeks[w] = 0 ;
        else {
            var spotWeek = user_weeks[w].indexOf("W");
            var week = parseInt(user_weeks[w].substr(spotWeek + 1));
            selectedWeeks[w] = week
        }
    }
    var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
    var leapYear = new Date(YEAR, 1, 29);
    if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
        monthLength[1] = 29;
    }
    
    for(var w = 0; w<5; w++){
        var weekData = selectedWeeks[w]-1;
        if(weekData !== -1){
            m1data.push(m_list_total_filter_imp[0][weekData])
            m2data.push(m_list_total_filter_imp[1][weekData])
            m9data.push(m_list_total_filter_imp[2][weekData])
        }
        else{
            m1data.push(0);
            m2data.push(0);
            m9data.push(0);
        }
    }

    for (var w = 0; w < 5; w++) {
        var weekData = selectedWeeks[w]-1;
        let tot_m1 = 0, tot_m2 = 0, tot_m9 = 0;
        if(weekData !== -1){
            for (var k = 0; k < commande_vendu_m1.length; k++) {
                tot_m1 += commande_vendu_m1[k].M1 / c_nbWeek * filterList[k];
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
                        console.log("debutDate is: "+debutDate+ " from week: " + debutWeek)
                        console.log("finDate is: "+finDate+ " to week: " + finWeek)

                        if(weekData+1 >= debutWeek && weekData+1<= finWeek){
                            var nb_jour = 0;
                            for(var l=debut-1; l<fin; l++){
                                nb_jour += monthLength[l]
                            }
                            console.log("nbjour is :" + nb_jour)
                            tot_m1 += vendu/nb_jour * 7 * filterList[k];
                        }
                    }
                }
            }
            vendu_m1.push(tot_m1);

            for (var k = 0; k < commande_vendu_m2.length; k++) {
                tot_m2 += commande_vendu_m2[k].M2 / c_nbWeek * filterList[k];
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

                        if(weekData+1 >= debutWeek && weekData+1<= finWeek){
                            var nb_jour = 0;
                            for(var l=debut-1; l<fin; l++){
                                nb_jour += monthLength[l]
                            }
                            tot_m2 += vendu/nb_jour * 7 * filterList[k];
                        }
                    }
                }
            }
            vendu_m2.push(tot_m2);

            for (var k = 0; k < commande_vendu_m9.length; k++) {
                tot_m9 += commande_vendu_m9[k].M9 / c_nbWeek * filterList[k];
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

                        if(weekData+1 >= debutWeek && weekData+1<= finWeek){
                            var nb_jour = 0;
                            for(var l=debut-1; l<fin; l++){
                                nb_jour += monthLength[l]
                            }
                            tot_m9 += vendu/nb_jour * 7 * filterList[k];
                        }
                    }
                }
            }
            vendu_m9.push(tot_m9);
        }
        else{
            vendu_m1.push(0);
            vendu_m2.push(0);
            vendu_m9.push(0);
        }
    }

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
    var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
    var leapYear = new Date(YEAR, 1, 29);
    if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
        monthLength[1] = 29;
    }
    var selectedWeeks = [0,0,0,0,0];
    for(var w = 0; w<5; w++){
        if(user_weeks[w]=== "")
            selectedWeeks[w] = 0 ;
        else {
            var spotWeek = user_weeks[w].indexOf("W");
            var week = parseInt(user_weeks[w].substr(spotWeek + 1));
            selectedWeeks[w] = week
        }
    }
    for (var i = 0; i < 3; i++) {
        let row = tbody.rows[i]
        for (let j = 0; j < 5; j++) {
            let num_cell = 3 * j;
            let obj = row.cells[num_cell + 1];
            let week = row.cells[num_cell + 2];
            let ecart = row.cells[num_cell + 3];
            let text = '';
            let weekNum = selectedWeeks[j]-1;
            if(weekNum === -1){
                text = 0;
            }
            else
                text = m_list_total_filter_imp[i][weekNum].toFixed(2);

            let objectif_mois = 0;

            var monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
            var leapYear = new Date(YEAR, 1, 29);
            if (leapYear.getDate() === 29) { // If it's a leap year, changes 28 to 29
                monthLength[1] = 29;
            }
            if (i === 0) {
                console.log("checking out m1");
                for (var k = 0; k < ListApplication.length; k++) {
                    objectif_mois += commande_vendu_m1[k].M1 / c_nbWeek * filterList[k];
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
                                objectif_mois += (vendu/nb_jour * 7) * filterList[k];
                            }
                        }
                    }
                }
            }
            else if (i === 1) {
                for (var k = 0; k < ListApplication.length; k++) {
                    objectif_mois += list_obj[i][k].M2 / c_nbWeek * filterList[k];
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
                                objectif_mois += (vendu/nb_jour * 7) * filterList[k];
                            }
                        }
                    }
                }
            }
            else if (i === 2) {
                for (var k = 0; k < ListApplication.length; k++) {
                    objectif_mois += list_obj[i][k].M9 / c_nbWeek * filterList[k];
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
                                objectif_mois += (vendu/nb_jour * 7) * filterList[k];
                            }
                        }
                    }
                }
            }

            if (text !== 0) week.innerText = text;
            else week.innerText = '';

            if (objectif_mois !== 0 && weekNum !== -1) obj.innerText = (objectif_mois).toFixed(2);
            else obj.innerText = '';

            var ec = parseFloat(obj.innerText) - text;
            if (objectif_mois + text !== 0 && user_weeks !=="") ecart.innerText = ec.toFixed(2);
            else ecart.innerText = ''

            if(isNaN(ec)) ecart.innerText = '';

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
   // console.log("inside filter function.");
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
function confirmWeeks(){
    for(var i=0; i<5; i++){
        var id= "s"+(i+1);
        user_weeks[i] = document.getElementById(id).value;
    }
    //console.log(user_weeks);
    setFilter();
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
}    */

var error = document.getElementById("error");
if (objList.length !== ListApplication.length || objList.length !== commande_vendu_m1.length) {
    error.innerHTML = "Veuillez vérifier si les noms des applications dans la table des commandes et dans la table des imputations sont les mêmes";
    error.style.color = "#ba0000"
} else {
    error.innerHTML = "";
}



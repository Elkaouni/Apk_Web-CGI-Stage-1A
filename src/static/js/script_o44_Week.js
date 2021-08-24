// noinspection JSDuplicatedDeclaration,JSUnresolvedFunction

var list1 = document.getElementById('listPersonneParApkMois').innerText;
var list2 = document.getElementById('ListApplication').innerText;
var list3 = document.getElementById('ListPersonne').innerText;

var items = JSON.parse(list1);   //listPersonneParApkMois
var ListApplication = JSON.parse(list2);
var ListPersonne = JSON.parse(list3);


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

/*////////////////////////////////////////////*/

let user_weeks= ["", "", "", "", ""];
const c_nbWeek = 52;

/*////////////////////////////////////////////*/

//Apk Filter -->

let filter_table = document.getElementById("filter_table");
var i = 0, count = 0;
let nb_columns = 9;
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
        } else {
            try {
                cell.innerHTML = "<label for='app_" + count + "'> " +
                    "            <input id='app_" + count + "' name='" + ListApplication[count].APPLICATION_NAME + "' " +
                    "                checked type='checkbox' value='" + count + "' data-idx='" + count + "'" +
                    "onchange='setFilter()'>" + ListApplication[count].APPLICATION_NAME +
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


/*////////////////////////////////////////////*/

const table = document.getElementById("table_personne_par_mois");
const thead = document.getElementById("thead");

let pList = [];
for (var i = 0; i < ListPersonne.length; i++) {
    pList.push([ListPersonne[i].WORK_LOGGED, []]); //liste vide per personne
}

//first sort servcies
for (var p = 0; p < ListPersonne.length; p++) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].WORK_LOGGED === ListPersonne[p].WORK_LOGGED) {
            pList[p][1].push(items[i]);
        }
    }
}
/*////////////////////////////////////////////*/

function draw_head(){
    let row = thead.insertRow(0);
    row.insertCell(0);
    let cell ;
    for(var i=0; i<5; i++){
        var id = "s"+(i+1);
        cell = row.insertCell(i+1);
        cell.innerHTML= "<label for='week'></label>" +
            "<input id='"+ id +"' type='week' name='week' >" +
            "<span class='validity'></span>" ;
        cell.name = "s"+(i+1);
    }
}
function draw_table(){
    draw_head()
     for (i = 0; i < ListPersonne.length; i++) {
         let row = table.insertRow(i);
         let personne = row.insertCell(0);
         personne.innerHTML = pList[i][0];
         for (let j = 0; j < 5; j++) {
             let semaine = row.insertCell(j + 1);
             let text = '';
             if (text != 0) semaine.innerText = text;
             else semaine.innerText = '';
         }
     }
 }
draw_table() ;

function mark_empty() {
    //empty rows
    for (i = 0; i < ListPersonne.length; i++) {
        let empty_row = true;
        let row = table.rows[i];
        for (var j = 0; j < 5; j++) {
            if (row.cells[j + 1].innerText !== "") {
                empty_row = false;
                break;
            }
        }
        if (empty_row === true) {
            for (var j = 0; j < 5; j++) {
                row.cells[j + 1].style.background = "#ababab";
            }
        } else {
            for (var j = 0; j < 5; j++) {
                row.cells[j + 1].style.background = "none";
            }
        }
    }
    //empty columns
    for (var j = 0; j < 5; j++) {
        let empty_column = true;
        for (var i = 0; i < ListPersonne.length; i++) {
            let row = table.rows[i];
            if (row.cells[j + 1].innerText !== '') {
                empty_column = false;
                break;
            }
        }

        if (empty_column === true) {
            for (var i = 0; i < ListPersonne.length; i++) {
                let row = table.rows[i];
                row.cells[j + 1].style.background = "#ababab";
            }
        }
    }
}
mark_empty();


/*////////////////////////////////////////////*/

//init lists
    let filterList_apk = []; // 1 if apk filter fo apk_i up, else 0
    let filterList_service = [1, 1, 1]; // 1 if service M filter fo apk_i up, else 0
    let p_list_imp_apk = [];   // [ imp[a1, ... an] * 12 MOIS ] pour P avec a1=[m1,m2,m9]

    for (var i = 0; i < ListApplication.length; i++) {
        filterList_apk.push(1);
    }

    for (var i = 0; i < ListPersonne.length; i++) {
        p_list_imp_apk.push([]);
        for (var week = 0; week < 53; week++) {
            p_list_imp_apk[i].push([]);
            for (var a = 0; a < ListApplication.length; a++) {
                p_list_imp_apk[i][week].push([0, 0, 0]);
            }
        }
    }


//prepare the table's values
    for (var p = 0; p < pList.length; p++) {
        for (k = 0; k < ListApplication.length; k++) {
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

                if (pList[p][1][item].APPLICATION === ListApplication[k].APPLICATION_NAME.substr(0, name_length)) {
                    let service = pList[p][1][item].SERVICE;
                    if (service === "M1") {
                        serv = 0;
                    } else if (service === "M2") {
                        serv = 1;
                    } else if (service === "M9") {
                        serv = 2;
                    }
                    p_list_imp_apk[p][week-1][k][serv] += pList[p][1][item].IMPUTATION;
                }
            }
        }
    }

    var p_list_total_filter_imp = []; //sum imp de chaque mois avec les 2 filtres
    for (var k = 0; k < ListPersonne.length; k++) {
        p_list_total_filter_imp.push([]);
        for (i = 0; i < 53; i++) {
            p_list_total_filter_imp[k].push(0);
        }
    }


    function calc_tableValues() {
        for (var p = 0; p < ListPersonne.length; p++) {
            for (var w = 0; w < 53; w++) {
                var s = 0;
                for (var k = 0; k < ListApplication.length; k++) {
                    for (var serv = 0; serv < 3; serv++) {
                        s += p_list_imp_apk[p][w][k][serv] * filterList_apk[k] * filterList_service[serv];
                    }
                    p_list_total_filter_imp[p][w] = s;
                }
            }
        }
    }

calc_tableValues();

// Bar chart -->

let colors = [
    "#000344", "#ff0000", "#ffe300", "#6356ff",
    "#b2c3f4", "#e34f78", "#00eeff", "#00ff4c",
    "#006a3a", "#06d671", "#00ff73", "#5fcb91",
    "#446300", "#edfe00", "#bec24e", "#fffa90",
    "#7b4900", "#d87402", "#ff9a3a", "#ffb682",
    "#85ff93", "#002a3e", "#acf400", "#962f3d",
];

let old_charts = [];
function drawChart() {
    let pdata = [];  // les imputations de chque personne sur l'année
    const labels = user_weeks;
    var selectedWeeks = [0,0,0,0,0];
    for(var w = 0; w<user_weeks.length; w++){
        if(user_weeks[w]=== "")
            selectedWeeks[w] = 0 ;
        else {
            var spotWeek = user_weeks[w].indexOf("W");
            var week = parseInt(user_weeks[w].substr(spotWeek + 1));
            selectedWeeks[w] = week
        }
    }

    for (var k = 0; k < p_list_total_filter_imp.length; k++) {
        var pweek = [];
        for(var w = 0; w<selectedWeeks.length; w++){
            var weekData = selectedWeeks[w]-1;
            if(weekData !== -1){
                pweek.push(p_list_total_filter_imp[k][weekData]);
            }
        }
        pdata.push(pweek);
    }


//draw charts for each staff
    let canvas = document.getElementById("canvas");

    let nbColumn = 4;
    let nbRows = Math.trunc(ListPersonne.length / nbColumn) + 1;
    let num_id = 0;
    var i = 0;
    while (i < nbRows) {
        try {
            let row = canvas.insertRow(i);
            for (var j = 0; j < nbColumn; j++) {
                let cell = row.insertCell(j);
                let id = 'o2_myChart' + num_id;
                let set_ij = {
                    label: ListPersonne[num_id].WORK_LOGGED,
                    data: pdata[num_id],
                    borderColor: colors[num_id],
                    backgroundColor: colors[num_id]
                };
                var dataset_ij = [set_ij];
                const data_ij = {
                    labels: labels,
                    datasets: dataset_ij
                };
                cell.innerHTML = " <canvas id= '" + id + "' style= 'width:100%; max-width:320px; margin: 2px'> </canvas>";
                num_id++;
                const config_ij = {
                    type: 'bar',
                    data: data_ij,
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    min: 0
                                }
                            }]
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

                var chart = new Chart(id, config_ij);
                old_charts.push(chart);
                if (num_id === ListPersonne.length) break;

            }
        } catch (e) {
            console.log(e);
        }
        if (num_id === ListPersonne.length) break;
        i++;
    }
}
drawChart();


////////// set filter

    function update_table() {
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

        for (i = 0; i < ListPersonne.length; i++) {
            let row = table.rows[i];
            for (let j = 0; j < user_weeks.length; j++) {
                let cell = row.cells[j + 1];

                let text = '';
                let weekNum = selectedWeeks[j]-1;
                if(weekNum === -1){
                    text = 0;
                }
                else
                    text = p_list_total_filter_imp[i][weekNum].toFixed(2);

                if (text != 0) cell.innerText = text;
                else cell.innerText = '';
            }
        }
        mark_empty();
    }

    function update_chart() {
        console.log("i m in update_chart");
        for (var i = 0; i < old_charts.length; i++) {
            old_charts[i].destroy()
        }
        drawChart();
    }
    function re_init_filterlist_apk() {
        for (var i = 0; i < ListApplication.length; i++) {
            filterList_apk[i] = 0;
        }
    }
    function re_init_filterlist_service() {
        filterList_service = [0, 0, 0];
    }
    function check_all_filterList_apk() {
        for (var i = 0; i < ListApplication.length; i++) {
            filterList_apk[i] = 1;
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
            re_init_filterlist_service();
            setApkFilter();
            setServiceFilter();
            calc_tableValues();
            update_table();
            update_chart();
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
        calc_tableValues();
        update_table();
        update_chart();
        console.log("filter apk reset");
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
    function checkAllApks() {
        for (var a = 0; a < ListApplication.length; a++) {
            var id_k = 'app_' + a;
            var apk = document.getElementById(id_k);
            apk.checked = true;
        }
        check_all_filterList_apk();
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

function confirmWeeks(){
    for(var i=0; i<5; i++){
        var id= "s"+(i+1);
        user_weeks[i] = document.getElementById(id).value;
    }
    setFilter();
}
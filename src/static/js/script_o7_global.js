// noinspection JSDuplicatedDeclaration,JSUnresolvedVariable

var list1 = document.getElementById('listServiceParApkMois').innerText;
var listTMAHTML = document.getElementById('listTMA').innerText;
var listHorsProdHTML = document.getElementById("listHorsProd").innerText;
var listIssuesHTML = document.getElementById("listIssues").innerText;
var listStationHTML = document.getElementById("listStation").innerText;

var itemsSA = JSON.parse(list1);
var listTMA = JSON.parse(listTMAHTML);
var listIssues = JSON.parse(listIssuesHTML);
var listStation = JSON.parse(listStationHTML);
var listHorprod = JSON.parse(listHorsProdHTML);

let last_month = listTMA[listTMA.length-1].MONTH;

///////////////////////////////////////////////////////////////
let filter_lot =  [1,1];
const c_prod_obj =70;
const c_manag_obj=14;
const c_hp_obj=16;


////////////////prod _ pilotage et contrôle
let m1list = [[],[]];
let m2list = [[],[]];
let m9list = [[],[]];

//first sort services
itemsSA.forEach(item => {
    if (item.SERVICE === "M1") {
        if(item.SELECT_LIST_3 === "Lot 1")
            m1list[0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            m1list[1].push(item);
    } else if (item.SERVICE === "M2") {
        if(item.SELECT_LIST_3 === "Lot 1")
            m2list[0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            m2list[1].push(item);
    } else if (item.SERVICE === "M9") {
        if(item.SELECT_LIST_3 === "Lot 1")
            m9list[0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            m9list[1].push(item);
    }
})
let mlist = [["M1", m1list], ["M2", m2list], ["M9", m9list]];

let prod_po_imps = [[[],[],[]] , [[],[],[]]]
for(var lot =0; lot<2; lot++){
    for(var m=0; m<3; m++) {
        for(var mois = 0; mois<12; mois++){
            prod_po_imps[lot][m].push(0);
        }
    }
}
function prepare_po() {
    for(var lot= 0; lot <2; lot++) {
        for (var m = 0; m < mlist.length; m++) {
            for (var mois = 0; mois < 12; mois++) {
                    let imp = 0;
                    for (var item = 0; item < mlist[m][1][lot].length; item++) {
                        if (mlist[m][1][lot][item].MONTH === mois + 1 ) {
                            imp += mlist[m][1][lot][item].IMPUTATION;
                        }
                    }
                    prod_po_imps[lot][m][mois] = imp;
            }
        }
    }
}
prepare_po();

var prod_po = [[], [], []]; //sum imp de chaque mois avec filtre
for (var k = 0; k < 3; k++) {
    for(var i = 0; i < 12; i++) {
        prod_po[k].push(0);
    }
}
function calc_prod_po() {
    for (var m = 0; m < 3; m++) {
        for (var mois = 0; mois < 12; mois++) {
            var s = 0;
            for(var lot = 0; lot<2; lot++) {
                s+=prod_po_imps[lot][m][mois]* filter_lot[lot]
            }
            prod_po[m][mois] = s;
        }
    }
}
calc_prod_po();


///////////////////  /prod _ TMA

//sort data

let mList_tma = [ ["M3/M4",[[],[]]], ["M5",[[],[]]], ["M6",[[],[]]], ["M7",[[],[]]], ["M8",[[],[]]],["M10",[[],[]]], ["M11",[[],[]]] ];
listTMA.forEach(item => {
    if (item.SELECT_LIST_1 === "M3" || item.SELECT_LIST_1 === "M4") {
        if(item.SELECT_LIST_3 === "Lot 1")
            mList_tma[0][1][0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            mList_tma[0][1][1].push(item);
    }
    else if (item.SELECT_LIST_1 === "M5") {
        if(item.SELECT_LIST_3 === "Lot 1")
            mList_tma[1][1][0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            mList_tma[1][1][1].push(item);
    }
    else if (item.SELECT_LIST_1 === "M6") {
        if(item.SELECT_LIST_3 === "Lot 1")
            mList_tma[2][1][0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            mList_tma[2][1][1].push(item);
    }
    else if (item.SELECT_LIST_1 === "M7") {
        if(item.SELECT_LIST_3 === "Lot 1")
            mList_tma[3][1][0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            mList_tma[3][1][1].push(item);
    }
    else if (item.SELECT_LIST_1 === "M8") {
        if(item.SELECT_LIST_3 === "Lot 1")
            mList_tma[4][1][0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            mList_tma[4][1][1].push(item);
    }
    else if (item.SELECT_LIST_1 === "M10") {
        if(item.SELECT_LIST_3 === "Lot 1")
            mList_tma[5][1][0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            mList_tma[5][1][1].push(item);
    }
    else if (item.SELECT_LIST_1 === "M11") {
        if(item.SELECT_LIST_3 === "Lot 1")
            mList_tma[6][1][0].push(item);
        else if(item.SELECT_LIST_3 === "Lot 5")
            mList_tma[6][1][1].push(item);
    }
})

let prod_tma_imps = [[[],[],[],[],[],[],[]] , [[],[],[],[],[],[],[]]]
for(var lot =0; lot<2; lot++){
    for(var m=0; m<7; m++) {
        for(var mois = 0; mois<12; mois++){
            prod_tma_imps[lot][m].push(0);
        }
    }
}
function prepare_tma() {
    for(var lot= 0; lot <2; lot++) {
        for (var m = 0; m < mList_tma.length; m++) {
            for (var mois = 0; mois < 12; mois++) {
                let imp = 0;
                for (var item = 0; item < mList_tma[m][1][lot].length; item++) {
                    if (mList_tma[m][1][lot][item].MONTH === mois + 1 ) {
                        imp += mList_tma[m][1][lot][item].HOURS/8;
                    }
                }
                prod_tma_imps[lot][m][mois] = imp;
            }
        }
    }
}
prepare_tma();

var prod_tma = [[],[],[],[],[],[],[]]; //sum imp de chaque mois avec filtre
for (var k = 0; k < 7; k++) {
    for(var i = 0; i < 12; i++) {
        prod_tma[k].push(0);
    }
}
function calc_prod_tma() {
    for (var m = 0; m < 7; m++) {
        for (var mois = 0; mois < 12; mois++) {
            var s = 0;
            for(var lot = 0; lot<2; lot++) {
                s+=prod_tma_imps[lot][m][mois]* filter_lot[lot]
            }
            prod_tma[m][mois] = s;
        }
    }
}
calc_prod_tma();


////////////////////  prod - station
//sort data
let mList_station = [ ["M3",[]], ["M7",[]] ];
listStation.forEach(item => {
    if (item.SELECT_LIST_1 === "M3" ) {
        mList_station[0][1].push(item);
    }
    else if (item.SELECT_LIST_1 === "M7") {
        mList_station[1][1].push(item);
    }
})

let prod_station_imps = [  [], [] ]
for(var m=0; m<2; m++) {
    for(var mois = 0; mois<12; mois++){
        prod_station_imps[m].push(0);
    }
}

function calc_prod_station() {
    for (var m = 0; m < 2; m++) {
        for (var mois = 0; mois < 12; mois++) {
            let imp = 0;
            for (var item = 0; item < mList_station[m][1].length; item++) {
                if (mList_station[m][1][item].MONTH === mois + 1 ) {
                    imp += mList_station[m][1][item].HOURS/8;
                }
            }
            prod_station_imps[m][mois] = imp;
        }
    }
}
calc_prod_station();

///////////////////////////////////////// management
let list_suivi =  [[],[]] ;

listHorprod.forEach(item => {
    if (item.SELECT_LIST_1 === "HORSPROD - Suivi_Pilotage_Lot") {
        if (item.SELECT_LIST_3 === "Lot 1" || item.SELECT_LIST_3 === "SI STATION")
            list_suivi[0].push(item);
        else if (item.SELECT_LIST_3 === "Lot 5")
            list_suivi[1].push(item);
    }
})


let manag_imps = [  [], [] ]
for(var lot=0; lot<2; lot++) {
    for(var mois = 0; mois<12; mois++){
        manag_imps[lot].push(0);
    }
}

function calc_manag() {
    for (var lot = 0; lot < 2; lot++) {
        for (var mois = 0; mois < 12; mois++) {
            let imp = 0;
            for (var item = 0; item < list_suivi[lot].length; item++) {
                if (list_suivi[lot][item].MONTH === mois + 1 ) {
                    imp += list_suivi[lot][item].HOURS/8;
                }
            }
            manag_imps[lot][mois] = imp;
        }
    }
}
calc_manag();

///////////////////  /horsprod

var listHP=[], listHPIssues = [];
listHorprod.forEach(item => {
    if (item.SELECT_LIST_1 !== "HORSPROD - Suivi_Pilotage_Lot") {
        listHP.push(item);
    }
})
listIssues.forEach(item => {
    if (item.SELECT_LIST_1 !== "HORSPROD - Suivi_Pilotage_Lot") {
        listHPIssues.push(item);
    }
})
//sort data
let list_horsprod = [[],[]];
for(var lot=0; lot < 2; lot++ ){
    for(var serv=0; serv < listHPIssues.length ; serv ++){
         list_horsprod[lot].push([]);
    }
}
listHP.forEach(item => {
    for(var serv =0; serv < listHPIssues.length ; serv ++) {
        if (item.SELECT_LIST_1 === listHPIssues[serv].SELECT_LIST_1 ) {
            if (item.SELECT_LIST_3 === "Lot 5")
                list_horsprod[1][serv].push(item);
            else
                list_horsprod[0][serv].push(item);
        }
    }
})

let hp_imps = [[] , []]
for(var lot =0; lot<2; lot++){
    for(var m=0; m<listHPIssues.length; m++) {
        hp_imps[lot].push([]);
        for(var mois = 0; mois<12; mois++){
            hp_imps[lot][m].push(0);
        }
    }
}
function prepare_hp() {
    for(var lot= 0; lot <2; lot++) {
        for (var m = 0; m < listHPIssues.length; m++) {
            for (var mois = 0; mois < 12; mois++) {
                let imp = 0;
                for (var item = 0; item < list_horsprod[lot][m].length; item++) {
                    if (list_horsprod[lot][m][item].MONTH === mois + 1 ) {
                        imp += list_horsprod[lot][m][item].HOURS/8;
                    }
                }
                hp_imps[lot][m][mois] = imp;
            }
        }
    }
}
prepare_hp();

var hp_sum = []; //sum imp de chaque mois avec filtre
for(var issue = 0; issue < listHPIssues.length; issue++){
    hp_sum.push([]);
    for(var i = 0; i < 12; i++) {
        hp_sum[issue].push(0);
    }
}

function calc_horsprod() {
    for (var m = 0; m < listHPIssues.length; m++) {
        for (var mois = 0; mois < 12; mois++) {
            var s = 0;
            for(var lot = 0; lot<2; lot++) {
                s+=hp_imps[lot][m][mois]* filter_lot[lot]
            }
            hp_sum[m][mois] = s;
        }
    }
}
calc_horsprod();


//////////////////////////////////////////////////////////////:

function calc_values(){
    calc_prod_po();
    calc_prod_tma();
    calc_prod_station();
    calc_manag();
    calc_horsprod();
}

/////// draw table and insert in table

const thead = document.getElementById("thead_tma");
const tbody = document.getElementById("tbody_tma");

let months =  ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aöut",
    "Septembre", "Octobre", "Novembre", "Décembre"]
let table_lables = [
    ["Production",
        ["P&C", "M1", "M2", "M9"]
        ,["TMA", "M3/M4", "M5", "M6", "M7", "M8", "M10", "M11"]
        ,["SI STATION", "M3-TNR","M7-Incident"]
    ],
    ["Management",
        ["Suivi Pilotage ( CP,DP)"]
    ],
    ["HORS PRODUCTION",[ ] ]
];

for(var k = 0; k<listIssues.length ; k++){
    var text = listIssues[k].SELECT_LIST_1 ;
    if(text === null)
        text = "Null" ;
    if(text !== "HORSPROD - Suivi_Pilotage_Lot")
        table_lables[2][1].push(text);
}

let row_num = 0;
function draw_head() {
    let head = thead.insertRow(0)
    let cell = head.insertCell(0);
    cell.rowSpan = 2 ;
    cell.innerHTML="<label>" +
        "<input type='checkbox' id='lot1' checked value='1' onchange='setFilter()'>Lot 1 " +
        "</label><br>" +
        "<label>" +
        "<input type='checkbox' id='lot5' checked value='5' onchange='setFilter()'>Lot 5 " +
        "</label"
    cell = head.insertCell(1);
    cell.rowSpan = 2 ;
    cell.innerText = "Objectifs %" ;
    let head2 = thead.insertRow(1);

    let cell2;
    for(var mois = 0; mois <last_month; mois++){
        let cell = head.insertCell(mois+2);
        cell.colSpan = 2;
        cell.innerText =  months[mois];
        cell2 = head2.insertCell(0);
        cell2.innerText = "%";
        cell2 = head2.insertCell(1);
        cell2.innerText = "Total Effort Hours";
    }
}
function draw_row_labels(){
    for(var i =0; i<table_lables.length; i++){
        let body = tbody.insertRow(row_num);
        row_num++;
        let cell = body.insertCell(0);
        cell.innerText = table_lables[i][0];
        body.style.background = "#c4c4c4"
        cell.style.background = "#a5a5a5"
        for(var lot =1; lot<table_lables[i].length; lot++){
            for(var c =0; c<table_lables[i][lot].length; c++) {
                body = tbody.insertRow(row_num);
                cell = body.insertCell(0);
                cell.innerText = table_lables[i][lot][c];
                if (c === 0 && i ===0) {
                    body.style.background = "rgb(229,229,245)"
                }
                row_num++;
            }
        }
    }
    let total_row = tbody.insertRow(row_num);
    let total_cell = total_row.insertCell(0);
    total_cell.innerText = "TOTAL"
    total_row.style.background = "#d8dfff"
    total_cell.style.background = "#8b8eff"
    total_cell.style.fontWeight = "bold"
    row_num++;
}
function draw_table(){
    draw_head()
    draw_row_labels();
    for(var i =0; i<row_num; i++){
        var row = tbody.rows[i];
        for(var j = 1; j <last_month*2+2; j++){
           let cell = row.insertCell(j);
           if(j>1) cell.innerText = 0;
           if(j%2 === 0) cell.innerText+= "%"
        }
    }
}
draw_table()

console.log("row_num :" + row_num)

function insert_production(prod_row) {
    prod_row.cells[1].innerText = c_prod_obj + "%" ;

    var pc = tbody.rows[1];
    var tma = tbody.rows[5];
    var station = tbody.rows[13];

    for (var mois = 0; mois < last_month; mois++) {
        //pilotage et contrôl
        var val = 0;
        for (var i = 2; i < 5; i++) {
            var cell_value = parseFloat(tbody.rows[i].cells[2 * (mois + 1) + 1].innerText);
            if(isNaN(cell_value))
                cell_value = 0;
            val += cell_value ;
        }
        if(val !== 0)
            pc.cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
        else
            pc.cells[2 * (mois + 1) + 1].innerText = "-";
        
        pc.cells[2 * (mois + 1) + 1].style.fontWeight = "bold";

        //tma
        var val = 0;
        for (var i = 6; i < 13; i++) {
            var cell_value = parseFloat(tbody.rows[i].cells[2 * (mois + 1) + 1].innerText);
            if(isNaN(cell_value))
                cell_value = 0;
            val += cell_value ;
        }
        if(val !==0)
            tma.cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
        else
            tma.cells[2 * (mois + 1) + 1].innerText = "-";
        tma.cells[2 * (mois + 1) + 1].style.fontWeight = "bold";

        //si station
        var val = 0;
        for (var i = 14; i < 16; i++) {
           var cell_value = parseFloat(tbody.rows[i].cells[2 * (mois + 1) + 1].innerText);
            if(isNaN(cell_value))
                cell_value = 0;
            val += cell_value ;
        }
        if(val !==0)
            station.cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
        else
            station.cells[2 * (mois + 1) + 1].innerText = "-";
        station.cells[2 * (mois + 1) + 1].style.fontWeight = "bold";

        //Production :
        var pc_val = parseFloat(pc.cells[2 * (mois + 1) + 1].innerText);
        var tma_val= parseFloat(tma.cells[2 * (mois + 1) + 1].innerText);
        var station_val = parseFloat(station.cells[2 * (mois + 1) + 1].innerText);

        if(isNaN(pc_val)) pc_val = 0
        if(isNaN(tma_val)) tma_val = 0
        if(isNaN(station_val)) station_val = 0
        var sum =   pc_val   + tma_val  + station_val ;

        if(sum !==0)
            prod_row.cells[2 * (mois + 1) + 1].innerText = sum.toFixed(1);
        else
            prod_row.cells[2 * (mois + 1) + 1].innerText = "-";
    }
}
function insert_management(management_row){
    management_row.cells[1].innerText = c_manag_obj + "%" ;

    for(var mois = 0; mois<last_month; mois++){
        var val = 0;
        var cell_val = parseFloat(tbody.rows[17].cells[2 * (mois +1)+1].innerText) ;
        if(isNaN(cell_val))
            cell_val = 0;
        val+= cell_val;
        if(val !== 0)
            management_row.cells[2 * (mois +1) +1].innerText = val.toFixed(1) ;
        else
            management_row.cells[2 * (mois +1) +1].innerText = "-" ;
    }
}
function insert_horsprod(horsprod_row){
    horsprod_row.cells[1].innerText = c_hp_obj + "%" ;

    for(var mois = 0; mois<last_month; mois++){
        var val = 0;
        for(var i = 19; i<row_num-1; i ++){
            var cellVal = parseFloat(tbody.rows[i].cells[2 * (mois +1)+1].innerText);
            if(isNaN(cellVal))
                cellVal = 0;
            val += cellVal;
        }
        if(val !==0)
            horsprod_row.cells[2 * (mois +1) +1].innerText = val.toFixed(1) ;
        else
            horsprod_row.cells[2 * (mois +1) +1].innerText = "-" ;
    }
}
function insert_totals(){
    var prod_row =  tbody.rows[0];
    var management_row =  tbody.rows[16];
    var horsprod_row =  tbody.rows[18];

    insert_production(prod_row);
    insert_management(management_row);
    insert_horsprod(horsprod_row);

    var total_row = tbody.rows[row_num-1];
    var obj_prod = prod_row.cells[1].innerText;
    var obj_manag = management_row.cells[1].innerText;
    var obj_hp = horsprod_row.cells[1].innerText;

    prod_row.cells[1].style.fontWeight = "bold";
    horsprod_row.cells[1].style.fontWeight = "bold";
    management_row.cells[1].style.fontWeight = "bold";
    total_row.cells[1].style.fontWeight = "bold";

    var prod_val = parseFloat(obj_prod.substr(0, obj_prod.indexOf("%")));
    var manag_val = parseFloat(obj_manag.substr(0, obj_manag.indexOf("%"))) ;
    var hp_val =   parseFloat(obj_hp.substr(0, obj_hp.indexOf("%"))) ;

    if(isNaN(prod_val)) prod_val = 0;
    if(isNaN(manag_val)) manag_val = 0;
    if(isNaN(hp_val)) hp_val = 0;

    total_row.cells[1].innerText = (prod_val + manag_val + hp_val).toFixed(1)+ "%";

    for(var mois = 0; mois<last_month; mois++){
        prod_val = parseFloat(prod_row.cells[2 * (mois +1)+1].innerText);
        manag_val = parseFloat(management_row.cells[2 * (mois +1)+1].innerText) ;
        hp_val = parseFloat(horsprod_row.cells[2 * (mois +1)+1].innerText) ;

        if(isNaN(prod_val)) prod_val = 0;
        if(isNaN(manag_val)) manag_val = 0;
        if(isNaN(hp_val)) hp_val = 0;

        var tot = prod_val + manag_val + hp_val
        total_row.cells[2 * (mois +1) +1].innerText = tot.toFixed(1);

        prod_row.cells[2 * (mois +1) +1].style.fontWeight = "bold";
        horsprod_row.cells[2 * (mois +1) +1].style.fontWeight = "bold";
        management_row.cells[2 * (mois +1) +1].style.fontWeight = "bold";
        total_row.cells[2 * (mois +1) +1].style.fontWeight = "bold";

    }

}
insert_totals();

function insert_objproduction(prod_row) {
    prod_row.cells[1].innerText = c_prod_obj.toFixed(1) + "%";

    var pc = tbody.rows[1];
    var tma = tbody.rows[5];
    var station = tbody.rows[13];

    //pilotage et contrôl
    for (var mois = 0; mois < last_month; mois++) {
        var obj_pc = 0;
        for (var i = 2; i < 5; i++) {
            var text = tbody.rows[i].cells[2 * (mois + 1)].innerText;
            if(text === "-"){
                obj_pc += 0;
            }
            else
                obj_pc += parseFloat(text.substr(0, text.indexOf("%")));
        }
        pc.cells[2 * (mois + 1)].innerText = obj_pc.toFixed(1) + "%";
        pc.cells[2 * (mois + 1)].style.fontWeight = "bold";

        //tma
        var obj_tma = 0;
        for (var i = 6; i < 13; i++) {
            var text = tbody.rows[i].cells[2 * (mois + 1)].innerText;
            if(text === "-")
                obj_tma+=0;
            else
                obj_tma += parseFloat(text.substr(0, text.indexOf("%")));
        }
        tma.cells[2 * (mois + 1)].innerText = obj_tma.toFixed(1) + "%";
        tma.cells[2 * (mois + 1)].style.fontWeight = "bold";

        //si station
        var obj_station = 0;
        for (var i = 14; i < 16; i++) {
            var text = tbody.rows[i].cells[2 * (mois + 1)].innerText;
            if(text === "-")
                obj_station+=0;
            else
                obj_station += parseFloat(text.substr(0, text.indexOf("%")));
        }
        station.cells[2 * (mois + 1)].innerText = obj_station.toFixed(1) + "%";
        station.cells[2 * (mois + 1)].style.fontWeight = "bold";

        //Production :
        var obj_sum = obj_pc + obj_tma+ obj_station;
        prod_row.cells[2 * (mois + 1)].innerText =  obj_sum.toFixed(1) + "%";
        if(obj_sum >= c_prod_obj) {
            prod_row.cells[2 * (mois + 1)].style.background = "#b3ffb0";
            prod_row.cells[2 * (mois + 1)+1].style.background = "#b3ffb0";
        }
        else{
            prod_row.cells[2 * (mois + 1)].style.background = "#ffccb0";
            prod_row.cells[2 * (mois + 1)+1].style.background = "#ffccb0";
        }
    }
}
function insert_objmanagement(management_row){
    management_row.cells[1].innerText = c_manag_obj.toFixed(1) + "%" ;

    for(var mois = 0; mois<last_month; mois++){
        var obj_sum = 0;

        var text = tbody.rows[17].cells[2 * (mois +1)].innerText;
        if(text === "-"){
            obj_sum += 0;
        }
        else
            obj_sum = parseFloat(text.substr(0, text.indexOf("%")));

        management_row.cells[2 * (mois +1)].innerText = obj_sum.toFixed(1) + "%" ;
        if(obj_sum <= c_manag_obj) {
            management_row.cells[2 * (mois + 1)].style.background = "#b3ffb0";
            management_row.cells[2 * (mois + 1)+1].style.background = "#b3ffb0";
        }
        else{
            management_row.cells[2 * (mois + 1)].style.background = "#ffccb0";
            management_row.cells[2 * (mois + 1)+1].style.background = "#ffccb0";
        }
    }
}
function insert_objhorsprod(horsprod_row){
    horsprod_row.cells[1].innerText = c_hp_obj.toFixed(1) + "%";

    for(var mois = 0; mois<last_month; mois++){
        var obj_sum = 0;
        for(var i = 19; i<row_num-1; i ++){
            var text = tbody.rows[i].cells[2 * (mois +1)].innerText;
            if(text === "-"){
                obj_sum += 0;
            }
            else
                obj_sum+= parseFloat(text.substr(0, text.indexOf("%")));
        }
        horsprod_row.cells[2 * (mois +1)].innerText = obj_sum.toFixed(1) + "%" ;
        if(obj_sum <= c_hp_obj) {
            horsprod_row.cells[2 * (mois + 1)].style.background = "#b3ffb0";
            horsprod_row.cells[2 * (mois + 1)+1].style.background = "#b3ffb0";
        }
        else{
            horsprod_row.cells[2 * (mois + 1)].style.background = "#ffccb0";
            horsprod_row.cells[2 * (mois + 1)+1].style.background = "#ffccb0";
        }
    }
}
function insert_objs(){
    var total_row = tbody.rows[row_num-1];
    var prod_row =  tbody.rows[0];
    var management_row =  tbody.rows[16];
    var horsprod_row =  tbody.rows[18];

    insert_objproduction(prod_row);
    insert_objmanagement(management_row);
    insert_objhorsprod(horsprod_row);
    
    var obj_prod = prod_row.cells[1].innerText;
    var obj_manag = management_row.cells[1].innerText;
    var obj_hp = horsprod_row.cells[1].innerText;

    prod_row.cells[1].style.fontWeight = "bold";
    horsprod_row.cells[1].style.fontWeight = "bold";
    management_row.cells[1].style.fontWeight = "bold";

    var prodVal = parseFloat(obj_prod.substr(0, obj_prod.indexOf("%")));
    var managVal =  parseFloat(obj_manag.substr(0, obj_manag.indexOf("%")));
    var hpVal =  parseFloat(obj_hp.substr(0, obj_hp.indexOf("%")));

    if(isNaN(prodVal)) prodVal = 0;
    if(isNaN(managVal)) managVal = 0;
    if(isNaN(hpVal)) hpVal = 0;

    total_row.cells[1].innerText = (prodVal+managVal+ hpVal).toFixed(1)+ "%";

    for(var mois = 0; mois<last_month; mois++){
        obj_prod = prod_row.cells[2 * (mois +1)].innerText;
        obj_manag = management_row.cells[2 * (mois +1)].innerText;
        obj_hp = horsprod_row.cells[2 * (mois +1)].innerText;

        prod_row.cells[2 * (mois +1)].style.fontWeight = "bold";
        horsprod_row.cells[2 * (mois +1)].style.fontWeight = "bold";
        management_row.cells[2 * (mois +1)].style.fontWeight = "bold";

        prodVal =parseFloat(obj_prod.substr(0, obj_prod.indexOf("%")));
        managVal =  parseFloat(obj_manag.substr(0, obj_manag.indexOf("%")));
        hpVal =  parseFloat(obj_hp.substr(0, obj_hp.indexOf("%")));

        if(isNaN(prodVal)) prodVal = 0;
        if(isNaN(managVal)) managVal = 0;
        if(isNaN(hpVal)) hpVal = 0;

        total_row.cells[2 * (mois +1)].innerText = (prodVal+ managVal + hpVal).toFixed(1)+ "%";

        total_row.cells[2 * (mois +1)].style.fontWeight = "bold";
    }

}
insert_objs();

function update_table(){
    //production
        //"pc"
        for (var mois = 0; mois < last_month; mois++) {
            for (var serv = 0; serv < 3; serv++) {
                var val = 0;

                val = prod_po[serv][mois];
                if(val !==0)
                    tbody.rows[serv+2].cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
                else
                    tbody.rows[serv+2].cells[2 * (mois + 1) + 1].innerText = "-";
            }
        }

        //tma
        for (var mois = 0; mois < last_month; mois++) {
            for (var serv = 0; serv < 7; serv++) {
                var val = 0;

                val = prod_tma[serv][mois] ;

                if(val !==0)
                    tbody.rows[serv +6].cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
                else
                    tbody.rows[serv +6].cells[2 * (mois + 1) + 1].innerText = "-"
            }
        }
        //station
        for (var mois = 0; mois < last_month; mois++) {
            for (var serv = 0; serv < 2; serv++) {
                var val = 0;

                val = prod_station_imps[serv][mois]*filter_lot[0];

                if(val !==0)
                    tbody.rows[serv +14].cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
                else
                    tbody.rows[serv +14].cells[2 * (mois + 1) + 1].innerText = "-";
            }
        }
    
    //management
    for (var mois = 0; mois < last_month; mois++) {
        var val = 0;
        val = manag_imps[0][mois]* filter_lot[0] +
            manag_imps[1][mois]* filter_lot[1] ;
        if(val !==0)
            tbody.rows[17].cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
        else
            tbody.rows[17].cells[2 * (mois + 1) + 1].innerText = "-";
    }

    //horsprod
    for (var mois = 0; mois < last_month; mois++) {
        for(var serv = 0; serv <listHPIssues.length ; serv ++) {
            var val = 0;
            val = hp_sum[serv][mois];

            if(val !== 0)
                tbody.rows[serv + 19].cells[2 * (mois + 1) + 1].innerText = val.toFixed(1);
            else
                tbody.rows[serv + 19].cells[2 * (mois + 1) + 1].innerText = "-" ;
        }
    }


    insert_totals();
    var total_row = tbody.rows[row_num-1];
    //objectifs production
        // pc
        for (var mois = 0; mois < last_month; mois++) {
            for (var serv = 0; serv < 3; serv++) {
                var val = 0, obj = 0;
                val = prod_po[serv][mois];

                var total =parseFloat(total_row.cells[2 * (mois + 1) +1].innerText);
                if(total !== 0) {
                    obj = val * 100 / total ;
                    if(obj !==0)
                        tbody.rows[serv+2].cells[2 * (mois + 1)].innerText = obj.toFixed(1) + "%";
                    else
                        tbody.rows[serv+2].cells[2 * (mois + 1)].innerText = "-"
                }
                else{
                    tbody.rows[serv+2].cells[2 * (mois + 1)].innerText = "-"
                }
            }
        }

        // tma
        for (var mois = 0; mois < last_month; mois++) {
            for (var serv = 0; serv < 7; serv++) {
                var val = 0, obj = 0;

                val = prod_tma[serv][mois] ;
                var total =parseFloat(total_row.cells[2 * (mois + 1) +1].innerText);
                if(total !== 0) {
                    obj = val*100/ total ;
                    if(obj !== 0)
                        tbody.rows[serv+6].cells[2 * (mois + 1)].innerText = obj.toFixed(1) + "%";
                    else
                        tbody.rows[serv+6].cells[2 * (mois + 1)].innerText ="-"
                }
                else{
                    tbody.rows[serv+6].cells[2 * (mois + 1)].innerText = "-"
                }
            }
        }

        //station
        for (var mois = 0; mois < last_month; mois++) {
            for (var serv = 0; serv < 2; serv++) {
                var val = 0, obj = 0;

                val = prod_station_imps[serv][mois]*filter_lot[0];

                var total =parseFloat(total_row.cells[2 * (mois + 1) +1].innerText);
                if(total !== 0) {
                    obj = val *100/ total ;
                    if(obj !==0)
                        tbody.rows[serv+14].cells[2 * (mois + 1)].innerText = obj.toFixed(1) + "%";
                    else
                        tbody.rows[serv+14].cells[2 * (mois + 1)].innerText = "-"
                }
                else{
                    tbody.rows[serv+14].cells[2 * (mois + 1)].innerText = "-"
                }
            }
        }

    //objectifs manageent
    for (var mois = 0; mois < last_month; mois++) {
        var val = 0, obj = 0;
        val = manag_imps[0][mois]* filter_lot[0] +
            manag_imps[1][mois]* filter_lot[1] ;

        var total =parseFloat(total_row.cells[2 * (mois + 1) +1].innerText);
        if(total !== 0) {
            obj = val*100 / total ;
            if(obj !==0)
                tbody.rows[17].cells[2 * (mois + 1)].innerText = obj.toFixed(1) + "%";
            else
                tbody.rows[17].cells[2 * (mois + 1)].innerText = "-" ;
        }
        else{
            tbody.rows[17].cells[2 * (mois + 1)].innerText = "-"
        }

    }

    //objectifs horprod
    for (var mois = 0; mois < last_month; mois++) {
        for(var serv = 0; serv <listHPIssues.length ; serv ++) {
            var val = 0;
            val = val = hp_sum[serv][mois];

            var total =parseFloat(total_row.cells[2 * (mois + 1) +1].innerText);
            if(total !== 0) {
                obj = val*100/ total ;
                if(obj !==0)
                    tbody.rows[serv + 19].cells[2 * (mois + 1)].innerText = obj.toFixed(1) + "%";
                else
                    tbody.rows[serv + 19].cells[2 * (mois + 1)].innerText = "-";
            }
            else{
                tbody.rows[serv + 19].cells[2 * (mois + 1)].innerText = "-"
            }
        }
    }
    insert_objs();
}
update_table();

function setFilter() {
    try {
        console.log("inside filter function.");
        var lot1 = document.getElementById("lot1");
        var lot5 = document.getElementById("lot5");
        if (lot1.checked) {
            filter_lot[0] = 1;
        } else {
            filter_lot[0] = 0;
        }
        if (lot5.checked) {
            filter_lot[1] = 1;
        } else {
            filter_lot[1] = 0;
        }
        calc_values();
        update_table();
    } catch (err) {
        console.log(err);
    }
}


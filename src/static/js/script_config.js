var list1 = document.getElementById('ListApplication').innerText;
var obj1 = document.getElementById('commande_brut_m1').innerText;
var obj2 = document.getElementById('commande_brut_m2').innerText;
var obj9 = document.getElementById('commande_brut_m9').innerText;

var ListApplication = JSON.parse(list1);
var commande_brut_m1 = JSON.parse(obj1);
var commande_brut_m2 = JSON.parse(obj2);
var commande_brut_m9 = JSON.parse(obj9);

console.log("I'm in the script: ");
console.log(commande_brut_m1);
console.log(commande_brut_m2);
console.log(commande_brut_m9);

let table= document.getElementById("config_table");
table.innerHTML = "";

function create_table(){
    for(var i=0; i<ListApplication.length ; i++){
        let row = table.insertRow(i);
        let apk = row.insertCell(0);
        apk.innerText = ListApplication[i].APPLICATIONS;

        let val_1, val_2, val_3, tot;

        let cell_1 = row.insertCell(1);
        val_1 = (commande_brut_m1[i].M1).toFixed(2) ;
        cell_1.innerText = val_1 + " €";

        let cell_2 = row.insertCell(2);
        val_2 = (commande_brut_m2[i].M2).toFixed(2);
        cell_2.innerText = val_2 + " €";

        let cell_3 = row.insertCell(3);
        val_3 = (commande_brut_m9[i].M9).toFixed(2);
        cell_3.innerText = val_3 + " €";

        let total = row.insertCell(4);
        tot = parseFloat(cell_3.innerText) +
            parseFloat(cell_2.innerText) +
            parseFloat(cell_1.innerText);
        tot = tot.toFixed(2);
        total.innerText = tot + " €";

        /*/////////////    RRR 3.7%    /////////////////////*/
        let rrr_1, rrr_2, rrr_3;

        cell_1 = row.insertCell(5);
        rrr_1 = val_1 * 0.037 ;
        cell_1.innerText = rrr_1.toFixed(2) + " €";

        cell_2 = row.insertCell(6);
        rrr_2 = val_2 * 0.037;
        cell_2.innerText = rrr_2.toFixed(2) + " €";

        cell_3 = row.insertCell(7);
        rrr_3 = val_3 * 0.037;
        cell_3.innerText = rrr_3.toFixed(2) + " €";

        total = row.insertCell(8);
        tot = (rrr_1 + rrr_2 + rrr_3).toFixed(2) ;
        total.innerText = tot + " €";


        /*/////////////    NETTE   /////////////////////*/
        cell_1 = row.insertCell(9);
        val_1 = val_1 - rrr_1 ;
        cell_1.innerText = val_1.toFixed(2) + " €";

        cell_2 = row.insertCell(10);
        val_2 = val_2 - rrr_2 ;
        cell_2.innerText = val_2.toFixed(2) + " €";

        cell_3 = row.insertCell(11);
        val_3 = val_3 - rrr_3 ;
        cell_3.innerText = val_3.toFixed(2) + " €";

        total = row.insertCell(12);
        tot = val_1 + val_2 + val_3;
        tot =tot.toFixed(2) ;
        total.innerText = tot + " €";


        /*/////////////   VENDU   /////////////////////*/
        cell_1 = row.insertCell(13);
        val_1 = val_1 / 393.02 ;
        cell_1.innerText = val_1.toFixed(2);

        cell_2 = row.insertCell(14);
        val_2 = val_2 / 393.02;
        cell_2.innerText = val_2.toFixed(2);

        cell_3 = row.insertCell(15);
        val_3 = val_3 / 393.02;
        cell_3.innerText = val_3.toFixed(2);

        total = row.insertCell(16);
        tot = (val_1 + val_2 + val_3).toFixed(2) ;
        total.innerText = tot;
    }
}
 create_table();




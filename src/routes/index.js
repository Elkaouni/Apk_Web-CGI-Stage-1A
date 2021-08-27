var express = require('express');
var router = express.Router();
var formidable = require('formidable');
const xlsx = require('xlsx');
var connectDB = require('../connectDB');

let listServiceParApkMois ;
let listPersonneParApkMois ;
let ListApplication ;
let ListPersonne ;

let listTMA, listEquipeTMA ;
let listHorsProd, listIssues ;
let listStation;

let ListApplication_config=[];
let commande_brut_m1 =[];
let commande_brut_m2 =[];
let commande_brut_m9 =[];

let commande_vendu_m1 =[];
let commande_vendu_m2=[];
let commande_vendu_m9=[];
let commande_tma_vendu=[];
let Applications_vendues=[];
let ticket_count=[];
let listAvenant;

function deleteSpaces(){
    try{
        var str1 = "", str2 = "", str9 = "";
        var space1 = -1, space2 = -1, space9 = -1.
        for (var j = 0; j < commande_vendu_m1.length; j++) {
            str1 = commande_vendu_m1[j].APPLICATIONS;
            space1 = str1.indexOf("  ");
            if (space1 !== -1) //found extra space
                commande_vendu_m1[j].APPLICATIONS = str1.substr(0, space1);   // in case there s many spaces aftr the name
        }
        for (var j = 0; j < commande_vendu_m2.length; j++) {
            str2 = commande_vendu_m2[j].APPLICATIONS;
            space2 = str2.indexOf("  ");
            if (space2 !== -1) //found extra space
                commande_vendu_m2[j].APPLICATIONS = str2.substr(0, space2);   // in case there s many spaces aftr the name
        }
        for (var j = 0; j < commande_vendu_m9.length; j++) {
            str9 = commande_vendu_m9[j].APPLICATIONS;
            space9 = str9.indexOf("  ");
            if(space9 !== -1) //found extra space
                commande_vendu_m9[j].APPLICATIONS = str9.substr(0,space9);   // in case there s many spaces aftr the nam
        }
    } catch(err){
        console.log("probleme with p&c")
        console.log(err.message)
    }
    
   try{
        for (var j = 0; j < commande_tma_vendu.length; j++) {
            var str1="", space1 =-1;
            if(commande_vendu_m9[j]!== undefined) {
                str1 = commande_tma_vendu[j].APPLICATIONS;
                space1 = str1.indexOf("  ");
            }
            if(space1 !== -1) //found extra space
                commande_tma_vendu[j].APPLICATIONS = str1.substr(0, space1);   // in case there s many spaces aftr the name
        }
    } catch(err){
        console.log("probleme with tma")
        console.log(err.message)
    }

    try{
        for (var j = 0; j < Applications_vendues.length; j++) {
            var str1="", space1 =-1;
            if(commande_vendu_m9[j]!== undefined) {
                str1 = Applications_vendues[j].APPLICATION_NAME;
                space1 = str1.indexOf("  ");
            }
            if(space1 !== -1) //found extra space
                Applications_vendues[j].APPLICATION_NAME = str1.substr(0, space1);   // in case there s many spaces aftr the name
        }
    } catch(err){
        console.log("probleme with apk")
        console.log(err.message)     
    }
    console.log("space deleted")
}

router.get("/", function(req, res){
    console.log("welcome page");
    res.render("uploadFile" );
});
router.post("/",  async function (req, res) {
    let m129_posts =[];
    let tma_posts = [];
    let hp_posts = [];
    let error_message ='';
    var form = new formidable.IncomingForm();
    await form.parse(req, async function (err, fields, files) {
        var filepath = files.file.path;
        console.log("Reading the xlsx file from: "+ filepath);
        try {
            const spreadsheet = xlsx.readFile(filepath);
            const sheets = spreadsheet.SheetNames;
            console.log('Sheet Names -- ' + sheets);
            const fisrtSheet = spreadsheet.Sheets[sheets[0]]; 

            //read commande excel sheet and save in posts
            for(let i=1; ;i++) {
                let columnA= fisrtSheet['A' + i];
                let columnB= fisrtSheet['B' + i];
                let columnC= fisrtSheet['C' + i];
                let columnD= fisrtSheet['D' + i];
                let columnE= fisrtSheet['E' + i];
                let columnF= fisrtSheet['F' + i];
                let columnG= fisrtSheet['G' + i];
                let columnH= fisrtSheet['H' + i];
                let columnI= fisrtSheet['I' + i];
                let columnJ= fisrtSheet['J' + i];
                let columnK= fisrtSheet['K' + i];
                let columnL= fisrtSheet['L' + i];
                let columnM= fisrtSheet['M' + i];
                let columnN= fisrtSheet['N' + i];
                let columnO= fisrtSheet['O' + i];
                let columnP= fisrtSheet['P' + i];
                let columnQ= fisrtSheet['Q' + i];

                if(!columnA || !columnB || !columnC || !columnD || !columnE || !columnF
                    || !columnG || !columnH || !columnI || !columnJ || !columnK
                    || !columnL || !columnM || !columnN || !columnO || !columnP || !columnQ) {
                    break;
                }
                //check the names of the columns
                if(i===1){ //check column names
                    if (columnA.v !== "Period Start" && columnA.v !== "Date") {
                        throw new Error("Le nom de la colonne doit être 'Period Start' ou 'Date'.\n");
                    }
                    else if (columnB.v !== "Year") {
                        throw new Error("Le nom de la colonne doit être 'Year'.\n");
                    }
                    else if (columnC.v !== "Month") {
                        throw new Error("Le nom de la colonne doit être 'Month'.\n");
                    }
                    else if (columnD.v !== "Day") {
                        throw new Error("Le nom de la colonne doit être 'Day'.\n");
                    }
                    else if (columnE.v !== "Work Logged By") {
                        throw new Error("Le nom de la colonne doit être 'Work Logged By'.\n");
                    }
                    else if (columnF.v !== "Issue") {
                        throw new Error("Le nom de la colonne doit être 'Issue'.\n");
                    }
                    else if (columnG.v !== "Issue Type") {
                        throw new Error("Le nom de la colonne doit être 'Issue Type'.\n");
                    }
                    else if (columnH.v !== "External Ticket ID") {
                        throw new Error("Le nom de la colonne doit être 'External Ticket ID'.\n");
                    }
                    else if (columnI.v !== "Select List 1") {
                        throw new Error("Le nom de la colonne doit être 'Select List 1'.\n");
                    }
                    else if (columnJ.v !== "Select List 3") {
                        throw new Error("Le nom de la colonne doit être 'Select List 3'.\n");
                    }
                    else if (columnK.v !== "Application Name") {
                        throw new Error("Le nom de la colonne doit être 'Application Name'.\n");
                    }
                    else if (columnL.v !== "Parent Key") {
                        throw new Error("Le nom de la colonne doit être 'Parent Key'.\n");
                    }
                    else if (columnM.v !== "Resolution Progress") {
                        throw new Error("Le nom de la colonne doit être 'Resolution Progress'.\n");
                    }
                    else if (columnN.v !== "Effort") {
                        throw new Error("Le nom de la colonne doit être 'Effort'.\n");
                    }
                    else if (columnO.v !== "Estimated Effort") {
                        throw new Error("Le nom de la colonne doit être 'Estimated Effort'.\n");
                    }
                    else if (columnP.v !== "Hours") {
                        throw new Error("Le nom de la colonne doit être 'Hours'.\n");
                    }
                    else if (columnQ.v !== "# of Issues") {
                        throw new Error("Le nom de la colonne doit être '# of Issues'.\n");
                    }
                }

                else{
                    let post= {};
                    post.Period_Start = columnA.v;

                    var year = parseFloat(columnB.v);
                    if (isNaN(year)) {
                        throw new Error("Valeur non numeric dans la colonne 'Year'.");
                    }
                    post.Year = year;

                    var month = parseFloat(columnC.v);
                    if (isNaN(month)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Month'.");
                    }
                    post.Month = month;

                    var day = parseFloat(columnD.v);
                    if (isNaN(day)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Day'.");
                    }
                    post.Day = day;

                    post.WORK_LOGGED_BY = columnE.v;
                    post.ISSUE = columnF.v;
                    post.ISSUE_TYPE = columnG.v;
                    post.EXTERNAL_TICKET_ID = columnH.v;
                    post.Select_List_1 = columnI.v;
                    post.Select_List_3 = columnJ.v;
                    post.Application_Name = columnK.v;
                    post.Parent_Key = columnL.v;
                    post.Resolution_Progress = columnM.v;

                    var effort = parseFloat(columnN.v);
                    if (isNaN(effort)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Effort'.");
                    }
                    post.Effort = effort;

                    var Estimated_Effort = parseFloat(columnO.v);
                    if (isNaN(Estimated_Effort)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Estimated_Effort'.");
                    }
                    post.Estimated_Effort = Estimated_Effort;

                    var hours = parseFloat(columnP.v);
                    if (isNaN(hours)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Hours'.");
                    }
                    post.Hours = hours;

                    var nb_issues = parseFloat(columnQ.v);
                    if (isNaN(nb_issues)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne '# of Issues'.");
                    }
                    post.nb_Issues = nb_issues;

                    post.Period_Start = post.Day + "/" + post.Month + "/" + post.Year;

                    var choix = post.Select_List_1.substr(0,3);
                    if(choix === "M1 " || choix === "M2 " || choix === "M9 "){
                        post.Select_List_1 = post.Select_List_1.substr(0,2)
                        m129_posts.push(post);
                    }
                    else{
                        if(post.Select_List_1.substr(0,3) === "M10" ||
                            post.Select_List_1.substr(0,3) === "M11" ||
                            post.Select_List_1.substr(0,3) === "M12" ||
                            post.Select_List_1.substr(0,3) === "M13"||
                            post.Select_List_1.substr(0,3) === "M14")
                        {
                            post.Select_List_1 = post.Select_List_1.substr(0,3);
                            tma_posts.push(post);
                        }
                        else if(post.Select_List_1[0] === 'M'){ //M3,4,5,6,7,8
                            post.Select_List_1 = post.Select_List_1.substr(0,2);
                            tma_posts.push(post);
                        }
                        else{
                            hp_posts.push(post);
                        }
                    }
                    post = {};
                }

            }

            console.log('m129_posts length ' + m129_posts.length);
            console.log('tma_posts length ' + tma_posts.length);
            await connectDB.run(m129_posts);
            await connectDB.run_tma(tma_posts);
            await connectDB.run_horsprod(hp_posts);
            await connectDB.get_station();
            
            listServiceParApkMois = JSON.stringify(connectDB.listServiceParApkMois) ;
            listPersonneParApkMois = JSON.stringify(connectDB.listPersonneParApkMois) ;
            ListApplication = JSON.stringify(connectDB.ListApplication) ;
            ListPersonne = JSON.stringify(connectDB.ListPersonne) ;

            listTMA = JSON.stringify(connectDB.listTMA) ;
            listEquipeTMA = JSON.stringify(connectDB.listEquipeTMA);

            listHorsProd = JSON.stringify(connectDB.listHORSPROD) ;
            listIssues = JSON.stringify(connectDB.listIssues);

            listStation = JSON.stringify(connectDB.listStation);

            await connectDB.get_commande_brut();
            commande_brut_m1 = JSON.stringify(connectDB.commande_brut_m1) ;
            commande_brut_m2 = JSON.stringify(connectDB.commande_brut_m2) ;
            commande_brut_m9 = JSON.stringify(connectDB.commande_brut_m9) ;
            ListApplication_config = JSON.stringify(connectDB.ListApplication_config) ;

            await connectDB.get_commande_vendu();
            commande_vendu_m1 = JSON.stringify(connectDB.commande_vendu_m1) ;
            commande_vendu_m2 = JSON.stringify(connectDB.commande_vendu_m2) ;
            commande_vendu_m9 = JSON.stringify(connectDB.commande_vendu_m9) ;
            commande_tma_vendu = JSON.stringify(connectDB.commande_tma_vendu) ;
            Applications_vendues = JSON.stringify(connectDB.Applications_vendues);
            ticket_count = JSON.stringify(connectDB.ticket_count);

            await connectDB.get_avenants();
            listAvenant = JSON.stringify(connectDB.listAvenant) ;

            deleteSpaces();

            console.log("Saved successfully.");
            console.log("Config up\n");

            res.redirect("/ServiceParMois");
        }
        catch (err) {
            console.log("\nThere's an error while uploading the file!! ");
            console.log(err.message);
            console.log("\nDue to the error, the file wasn't saved.");
            error_message = err.message;

            res.render("uploadFile",
                {error_message: error_message});
        }
    });
});

router.post("/skip",async function (req, res){
    let error_message ='';
    try {
        await connectDB.get_m129();
        listServiceParApkMois = JSON.stringify(connectDB.listServiceParApkMois) ;
        listPersonneParApkMois = JSON.stringify(connectDB.listPersonneParApkMois) ;
        ListApplication = JSON.stringify(connectDB.ListApplication) ;
        ListPersonne = JSON.stringify(connectDB.ListPersonne) ;

        await connectDB.get_tma();
        listTMA = JSON.stringify(connectDB.listTMA) ;
        listEquipeTMA = JSON.stringify(connectDB.listEquipeTMA);

        await connectDB.get_horsprod();
        listHorsProd = JSON.stringify(connectDB.listHORSPROD) ;
        listIssues = JSON.stringify(connectDB.listIssues);

        await connectDB.get_station();
        listStation = JSON.stringify(connectDB.listStation);

        await connectDB.get_commande_brut();
        commande_brut_m1 = JSON.stringify(connectDB.commande_brut_m1) ;
        commande_brut_m2 = JSON.stringify(connectDB.commande_brut_m2) ;
        commande_brut_m9 = JSON.stringify(connectDB.commande_brut_m9) ;
        ListApplication_config = JSON.stringify(connectDB.ListApplication_config) ;

        await connectDB.get_commande_vendu();
        commande_vendu_m1 = JSON.stringify(connectDB.commande_vendu_m1) ;
        commande_vendu_m2 = JSON.stringify(connectDB.commande_vendu_m2) ;
        commande_vendu_m9 = JSON.stringify(connectDB.commande_vendu_m9) ;
        commande_tma_vendu = JSON.stringify(connectDB.commande_tma_vendu) ;
        Applications_vendues = JSON.stringify(connectDB.Applications_vendues)
        ticket_count = JSON.stringify(connectDB.ticket_count);

        await connectDB.get_avenants();
        listAvenant = JSON.stringify(connectDB.listAvenant);
        console.log("listAvenant -->" + listAvenant)

        deleteSpaces();

        console.log("Get request:  succeeded");
        res.redirect("/ServiceParMois");
    }
    catch (err) {
        console.log("\nThere's an error while uploading the file!! ");
        console.log(err.message);
        console.log("\nDue to the error, the file wasn't saved.");
        error_message = err.message;

        res.render("uploadFile"
            , {error_message: error_message});
    }
} )

router.get("/imputations", function(req, res){
    console.log("welcome page");
    res.render("imputations" );
});
router.post("/newfileupload",  async function (req, res) {
    let m129_posts =[];
    let tma_posts = [];
    let hp_posts = [];
    let error_message ='';
    var form = new formidable.IncomingForm();
    await form.parse(req, async function (err, fields, files) {
        var filepath = files.file.path;
        console.log("Reading the xlsx file from: "+ filepath);
        try {
            const spreadsheet = xlsx.readFile(filepath);
            const sheets = spreadsheet.SheetNames;
            console.log('Sheet Names -- ' + sheets);
            const fisrtSheet= spreadsheet.Sheets[sheets[0]];

            //read excel sheet and save in posts
            for(let i=1; ;i++) {
                let columnA= fisrtSheet['A' + i];
                let columnB= fisrtSheet['B' + i];
                let columnC= fisrtSheet['C' + i];
                let columnD= fisrtSheet['D' + i];
                let columnE= fisrtSheet['E' + i];
                let columnF= fisrtSheet['F' + i];
                let columnG= fisrtSheet['G' + i];
                let columnH= fisrtSheet['H' + i];
                let columnI= fisrtSheet['I' + i];
                let columnJ= fisrtSheet['J' + i];
                let columnK= fisrtSheet['K' + i];
                let columnL= fisrtSheet['L' + i];
                let columnM= fisrtSheet['M' + i];
                let columnN= fisrtSheet['N' + i];
                let columnO= fisrtSheet['O' + i];
                let columnP= fisrtSheet['P' + i];
                let columnQ= fisrtSheet['Q' + i];

                if(!columnA || !columnB || !columnC || !columnD || !columnE || !columnF
                    || !columnG || !columnH || !columnI || !columnJ || !columnK
                    || !columnL || !columnM || !columnN || !column0|| !columnP || !columnQ) {
                    break;
                }
                //check the names of the columns
                if(i===1){ //check column names
                    if (columnA.v !== "Period Start"&& columnA.v !== "Date") {
                        throw new Error("Le nom de la colonne doit être 'Period Start'.\n");
                    }
                    else if (columnB.v !== "Year") {
                        throw new Error("Le nom de la colonne doit être 'Year'.\n");
                    }
                    else if (columnC.v !== "Month") {
                        throw new Error("Le nom de la colonne doit être 'Month'.\n");
                    }
                    else if (columnD.v !== "Day") {
                        throw new Error("Le nom de la colonne doit être 'Day'.\n");
                    }
                    else if (columnE.v !== "Work Logged By") {
                        throw new Error("Le nom de la colonne doit être 'Work Logged By'.\n");
                    }
                    else if (columnF.v !== "Issue") {
                        throw new Error("Le nom de la colonne doit être 'Issue'.\n");
                    }
                    else if (columnG.v !== "Issue Type") {
                        throw new Error("Le nom de la colonne doit être 'Issue Type'.\n");
                    }
                    else if (columnH.v !== "External Ticket ID") {
                        throw new Error("Le nom de la colonne doit être 'External Ticket ID'.\n");
                    }
                    else if (columnI.v !== "Select List 1") {
                        throw new Error("Le nom de la colonne doit être 'Select List 1'.\n");
                    }
                    else if (columnJ.v !== "Select List 3") {
                        throw new Error("Le nom de la colonne doit être 'Select List 3'.\n");
                    }
                    else if (columnK.v !== "Application Name") {
                        throw new Error("Le nom de la colonne doit être 'Application Name'.\n");
                    }
                    else if (columnL.v !== "Parent Key") {
                        throw new Error("Le nom de la colonne doit être 'Parent Key'.\n");
                    }
                    else if (columnM.v !== "Resolution Progress") {
                        throw new Error("Le nom de la colonne doit être 'Resolution Progress'.\n");
                    }
                    else if (columnN.v !== "Effort") {
                        throw new Error("Le nom de la colonne doit être 'Effort'.\n");
                    }
                    else if (columnO.v !== "Estimated Effort") {
                        throw new Error("Le nom de la colonne doit être 'Estimated Effort'.\n");
                    }
                    else if (columnP.v !== "Hours") {
                        throw new Error("Le nom de la colonne doit être 'Hours'.\n");
                    }
                    else if (columnQ.v !== "# of Issues") {
                        throw new Error("Le nom de la colonne doit être '# of Issues'.\n");
                    }
                }

                else{
                    let post= {};
                    post.Period_Start = columnA.v;

                    var year = parseFloat(columnB.v);
                    if (isNaN(year)) {
                        throw new Error("Valeur non numeric dans la colonne 'Year'.");
                    }
                    post.Year = year;

                    var month = parseFloat(columnC.v);
                    if (isNaN(month)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Month'.");
                    }
                    post.Month = month;

                    var day = parseFloat(columnD.v);
                    if (isNaN(day)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Day'.");
                    }
                    post.Day = day;

                    post.WORK_LOGGED_BY = columnE.v;
                    post.ISSUE = columnF.v;
                    post.ISSUE_TYPE = columnG.v;
                    post.EXTERNAL_TICKET_ID = columnH.v;
                    post.Select_List_1 = columnI.v;
                    post.Select_List_3 = columnJ.v;
                    post.Application_Name = columnK.v;
                    post.Parent_Key = columnL.v;
                    post.Resolution_Progress = columnM.v;

                    var effort = parseFloat(columnN.v);
                    if (isNaN(effort)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Effort'.");
                    }
                    post.Effort = effort;

                    var Estimated_Effort = parseFloat(columnO.v);
                    if (isNaN(Estimated_Effort)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Estimated_Effort'.");
                    }
                    post.Estimated_Effort = Estimated_Effort;

                    var hours = parseFloat(columnP.v);
                    if (isNaN(hours)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Hours'.");
                    }
                    post.Hours = hours;

                    var nb_issues = parseFloat(columnQ.v);
                    if (isNaN(nb_issues)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne '# of Issues'.");
                    }
                    post.nb_Issues = nb_issues;

                    post.Period_Start = post.Day + "/" + post.Month + "/" + post.Year;

                    var choix = post.Select_List_1.substr(0,3);
                    if(choix === "M1 " || choix === "M2 " || choix === "M9 "){
                        post.Select_List_1 = post.Select_List_1.substr(0,2)
                        m129_posts.push(post);
                    }
                    else{
                        if(post.Select_List_1.substr(0,3) === "M10" ||
                            post.Select_List_1.substr(0,3) === "M11" ||
                            post.Select_List_1.substr(0,3) === "M12" ||
                            post.Select_List_1.substr(0,3) === "M13"||
                            post.Select_List_1.substr(0,3) === "M14")
                        {
                            post.Select_List_1 = post.Select_List_1.substr(0,3);
                            tma_posts.push(post);
                        }
                        else if(post.Select_List_1[0] === 'M'){ //M3,4,5,6,7,8
                            post.Select_List_1 = post.Select_List_1.substr(0,2);
                            tma_posts.push(post);
                        }
                        else{
                            hp_posts.push(post);
                        }
                    }
                    post = {};
                }

            }
            console.log('m129_posts length ' + m129_posts.length);
            console.log('tma_posts length ' + tma_posts.length);
            //await connectDB.run(posts);
            await connectDB.run(m129_posts);
            await connectDB.run_tma(tma_posts);
            await connectDB.run_horsprod(hp_posts);

            listServiceParApkMois = JSON.stringify(connectDB.listServiceParApkMois) ;
            listPersonneParApkMois = JSON.stringify(connectDB.listPersonneParApkMois) ;
            ListApplication = JSON.stringify(connectDB.ListApplication) ;
            ListPersonne = JSON.stringify(connectDB.ListPersonne) ;

            listTMA = JSON.stringify(connectDB.listTMA) ;
            listEquipeTMA = JSON.stringify(connectDB.listEquipeTMA);

            listHorsProd = JSON.stringify(connectDB.listHORSPROD) ;
            listIssues = JSON.stringify(connectDB.listIssues);

            await connectDB.get_station();
            listStation = JSON.stringify(connectDB.listStation);

            await connectDB.get_commande_brut();
            commande_brut_m1 = JSON.stringify(connectDB.commande_brut_m1) ;
            commande_brut_m2 = JSON.stringify(connectDB.commande_brut_m2) ;
            commande_brut_m9 = JSON.stringify(connectDB.commande_brut_m9) ;
            ListApplication_config = JSON.stringify(connectDB.ListApplication_config) ;

            await connectDB.get_commande_vendu();
            commande_vendu_m1 = JSON.stringify(connectDB.commande_vendu_m1) ;
            commande_vendu_m2 = JSON.stringify(connectDB.commande_vendu_m2) ;
            commande_vendu_m9 = JSON.stringify(connectDB.commande_vendu_m9) ;
            commande_tma_vendu = JSON.stringify(connectDB.commande_tma_vendu) ;
            Applications_vendues = JSON.stringify(connectDB.Applications_vendues);
            ticket_count = JSON.stringify(connectDB.ticket_count);

            await connectDB.get_avenants();
            listAvenant = JSON.stringify(connectDB.listAvenant) ;

            deleteSpaces();

            console.log("Saved successfully. Test");
            console.log("Config up\n");

            res.redirect("/ServiceParMois");
        }
        catch (err) {
            console.log("\nThere's an error while uploading the file!! ");
            console.log(err.message);
            console.log("\nDue to the error, the file wasn't saved.");
            error_message = err.message;

            res.render("uploadFile"
                , {error_message: error_message});
        }
    });
});

router.get("/config", function(req, res){
    console.log("config get");
    res.render("config",
        {ListApplication: ListApplication_config,
            commande_brut_m1: commande_brut_m1,
            commande_brut_m2: commande_brut_m2,
            commande_brut_m9: commande_brut_m9} );
});
router.post("/config", async function(req, res){
    let error_message ='';
    let avenant_list = [];
    let commandes = [];
    console.log("let's first check the xlsx config file");
    var form = new formidable.IncomingForm();
    await form.parse(req, async function (err, fields, files) {
        try {
            var filepath = files.file.path;
            console.log("Reading the xlsx file from: "+ filepath);
            const spreadsheet = xlsx.readFile(filepath);
            const sheets = spreadsheet.SheetNames;
            console.log('Sheet Names -- ' + sheets);
            const fisrtSheet= spreadsheet.Sheets[sheets[0]];
            const secondSheet = spreadsheet.Sheets[sheets[1]];  //Avenant

            //read excel sheet and save in posts
            for(let i=1; ;i++) {
                let columnA= fisrtSheet['A' + i];
                let columnB= fisrtSheet['B' + i];
                let columnC= fisrtSheet['C' + i];
                let columnD= fisrtSheet['D' + i];
                let columnE= fisrtSheet['E' + i];
                let columnF= fisrtSheet['F' + i];
                let columnG= fisrtSheet['G' + i];
                let columnH= fisrtSheet['H' + i];
                let columnI= fisrtSheet['I' + i];
                let columnJ= fisrtSheet['J' + i];
                let columnK= fisrtSheet['K' + i];
                let columnL= fisrtSheet['L' + i];

                if( i>2 && (!columnA || !columnB || !columnC || !columnD
                    || !columnE || !columnF || !columnG || !columnH || !columnI
                    || !columnJ || !columnK || !columnL)) {
                    break;
                }
                //check the names of the columns
                if(i===1){ //check column names
                    if (columnB.v !== 'M1') {
                        throw new Error("Le nom de la colonne doit être: 'M1'.\n");
                    }

                    else if (columnC.v !== 'M2') {
                        throw new Error("Le nom de la colonne doit être: 'M2'.\n");
                    }

                    else if (columnD.v !== "M3") {
                        throw new Error("Le nom de la colonne doit être: 'M3'.\n");
                    }
                    else if (columnE.v !== "M4") {
                        throw new Error("Le nom de la colonne doit être: 'M4'.\n");
                    }
                    else if (columnF.v !== "M5") {
                        throw new Error("Le nom de la colonne doit être: 'M5'.\n");
                    }
                    else if (columnG.v !== "M6") {
                        throw new Error("Le nom de la colonne doit être: 'M6'.\n");
                    }
                    else if (columnH.v !== "M7") {
                        throw new Error("Le nom de la colonne doit être: 'M7'.\n");
                    }
                    else if (columnI.v !== "M8") {
                        throw new Error("Le nom de la colonne doit être: 'M8'.\n");
                    }
                    else if (columnJ.v !== "M9") {
                        throw new Error("Le nom de la colonne doit être: 'M9'.\n");
                    }
                    else if (columnK.v !== "M10") {
                        throw new Error("Le nom de la colonne doit être: 'M10'.\n");
                    }
                    else if (columnL.v !== "M11") {
                        throw new Error("Le nom de la colonne doit être: 'M11'.\n");
                    }
                }
                else{
                    let post= {};

                    post.Application = columnA.v;
                    var m1 = parseFloat(columnB.v);
                    if (isNaN(m1)) {
                        throw new Error("Encountered a non numeric value in M1.");
                    }
                    post.m1 = m1;

                    var m2 = parseFloat(columnC.v);
                    if (isNaN(m2)) {
                        throw new Error("Encountered a non numeric value in M2.");
                    }
                    post.m2 = m2;

                    var m3 = parseFloat(columnD.v);
                    if (isNaN(m3)) {
                        throw new Error("Encountered a non numeric value in M3.");
                    }
                    post.m3 = m3;

                    var m4 = parseFloat(columnE.v);
                    if (isNaN(m4)) {
                        throw new Error("Encountered a non numeric value in M4.");
                    }
                    post.m4 = m4;

                    var m5 = parseFloat(columnF.v);
                    if (isNaN(m5)) {
                        throw new Error("Encountered a non numeric value in M5.");
                    }
                    post.m5 = m5;

                    var m6 = parseFloat(columnG.v);
                    if (isNaN(m6)) {
                        throw new Error("Encountered a non numeric value in M6.");
                    }
                    post.m6 = m6;

                    var m7 = parseFloat(columnH.v);
                    if (isNaN(m7)) {
                        throw new Error("Encountered a non numeric value in M7.");
                    }
                    post.m7 = m7;

                    var m8 = parseFloat(columnI.v);
                    if (isNaN(m8)) {
                        throw new Error("Encountered a non numeric value in M8.");
                    }
                    post.m8 = m9;

                    var m9 = parseFloat(columnJ.v);
                    if (isNaN(m9)) {
                        throw new Error("Encountered a non numeric value in M9.");
                    }
                    post.m9 = m9;

                    var m10 = parseFloat(columnK.v);
                    if (isNaN(m10)) {
                        throw new Error("Encountered a non numeric value in M10.");
                    }
                    post.m10 = m10;

                    var m11 = parseFloat(columnL.v);
                    if (isNaN(m11)) {
                        throw new Error("Encountered a non numeric value in M11.");
                    }
                    post.m11 = m11;
                    post.m12 = 0;

                  //  console.log('post ' + i + ' --- '  + JSON.stringify(post));
                    commandes.push(post);
                    post = {};
                }
            }

            //read avenant excel sheet and save in posts
            for(let i=1; ;i++) {
                let columnA= secondSheet['A' + i];
                let columnB= secondSheet['B' + i];
                let columnC= secondSheet['C' + i];
                let columnD= secondSheet['D' + i];
                let columnE= secondSheet['E' + i];
                let columnF= secondSheet['F' + i];

                if(!columnB || !columnC || !columnD || !columnE || !columnF
                    || (!columnA && i>1)) {
                    break;
                }
                //check the names of the columns
                if(i===1){ //check column names
                    if (columnB.v !== "Mois début") {
                        throw new Error("Le nom de la colonne doit être 'Mois début'.\n");
                    }
                    else if (columnC.v !== "Mois fin") {
                        throw new Error("Le nom de la colonne doit être 'Mois fin'.\n");
                    }
                    else if (columnD.v !== "M1") {
                        throw new Error("Le nom de la colonne doit être 'M1'.\n");
                    }
                    else if (columnE.v !== "M2") {
                        throw new Error("Le nom de la colonne doit être 'M2'.\n");
                    }
                    else if (columnF.v !== "M9") {
                        throw new Error("Le nom de la colonne doit être 'M9'.\n");
                    }
                }
                else{
                    let avenant= {};
                    avenant.Application = columnA.v;

                    var debut = parseFloat(columnB.v);
                    if (isNaN(debut)) {
                        throw new Error("Valeur non numeric dans la colonne 'Mois début'.");
                    }
                    avenant.Debut = debut;

                    var fin = parseFloat(columnC.v);
                    if (isNaN(fin)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'Mois fin'.");
                    }
                    avenant.Fin = fin;

                    var m1 = parseFloat(columnD.v);
                    if (isNaN(m1)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'M1'.");
                    }
                    avenant.m1 = m1;

                    var m2 = parseFloat(columnE.v);
                    if (isNaN(m2)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'M2'.");
                    }
                    avenant.m2 = m2;

                    var m9 = parseFloat(columnF.v);
                    if (isNaN(m9)) {     // not a number
                        throw new Error("Valeur non numeric dans la colonne 'M9'.");
                    }
                    avenant.m9 = m9;
                    console.log("avenant is-->" + avenant)
                    avenant_list.push(avenant);
                    avenant = {};
                }

            }
            console.log("avenant_list")
            console.log(avenant_list)
            //inserts config and returns commandes_bruts $ vendues
            await connectDB.set_config(commandes);
            await connectDB.set_vendu(commandes);
            await connectDB.set_avenants(avenant_list);

            commande_brut_m1 = JSON.stringify(connectDB.commande_brut_m1) ;
            commande_brut_m2 = JSON.stringify(connectDB.commande_brut_m2) ;
            commande_brut_m9 = JSON.stringify(connectDB.commande_brut_m9) ;
            ListApplication_config = JSON.stringify(connectDB.ListApplication_config);

            commande_vendu_m1 = JSON.stringify(connectDB.commande_vendu_m1) ;
            commande_vendu_m2 = JSON.stringify(connectDB.commande_vendu_m2) ;
            commande_vendu_m9 = JSON.stringify(connectDB.commande_vendu_m9) ;
            Applications_vendues = JSON.stringify(connectDB.Applications_vendues)
            ticket_count = JSON.stringify(connectDB.ticket_count);

            listAvenant = JSON.stringify(connectDB.listAvenant) ;

            deleteSpaces();

            console.log("Saved successfully.");
            res.render("config",
                {ListApplication: ListApplication_config,
                    commande_brut_m1: commande_brut_m1,
                    commande_brut_m2: commande_brut_m2,
                    commande_brut_m9: commande_brut_m9});
        }
        catch (err) {
            console.log("\nThere's an error while uploading the file!! ");
            console.log(err.message);
            console.log("\nDue to the error, we'll keep using the current database..");
            error_message = err.message + "\nLe nouveau fichier config n'a pas pu être téléchargé."+
                "\nDue à l'erreur, nous allons continuer à utiliser la configuration " +
                "actuellement disponible dans la base de données.";

            res.render("config" , {error_message: error_message});
        }
    });
});


       //ServiceParMois
router.get("/ServiceParMois", function(req, res, next){
    console.log("ServiceParMois page");
    res.render("o1_ServiceParMois",
        {listServiceParApkMois: listServiceParApkMois,
        ListApplication: ListApplication,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9
        });
});
router.post("/ServiceParMois", function(req, res){
    console.log("ServiceParMois refresh");
    res.render("o1_ServiceParMois",
        {listServiceParApkMois: listServiceParApkMois,
            ListApplication: ListApplication,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9});
});

//------------------> per week
router.get("/ServiceParMoisWeek", function(req, res, next){
    console.log("ServiceParMois per week page");
    res.render("o11_Week_ServiceParMois",
        {listServiceParApkMois: listServiceParApkMois,
            ListApplication: ListApplication,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9
        });
});



       //ServiceParApk

router.get("/ServiceParApk", function(req, res){
    console.log("ServiceParApk page");
    res.render("o2_ServiceParApk",
        {listServiceParApkMois: listServiceParApkMois,
            ListApplication: ListApplication,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9 });
});
router.post("/ServiceParApk", function(req, res){
    console.log("ServiceParApk refresh");
    res.render("o2_ServiceParApk",
        {listServiceParApkMois: listServiceParApkMois,
            ListApplication: ListApplication,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9 });
});

//---------->per week
router.get("/ServiceParApkWeek", function(req, res){
    console.log("ServiceParApk page");
    res.render("o22_Week_ServiceParApk",
        {listServiceParApkMois: listServiceParApkMois,
            ListApplication: ListApplication,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9 });
});



       //o3_PersonneParApk

router.get("/PersonneParApk", function(req, res){
    console.log("PersonneParApk page");
    res.render("o3_PersonneParApk",
        {listPersonneParApkMois: listPersonneParApkMois,
            ListApplication: ListApplication,
            ListPersonne: ListPersonne,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9});
});
router.post("/PersonneParApk", function(req, res){
    console.log("PersonneParApk refresh");
    res.render("o3_PersonneParApk",
        {listPersonneParApkMois: listPersonneParApkMois,
            ListApplication: ListApplication,
            ListPersonne: ListPersonne,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9 });
});

//-------> per week
router.get("/PersonneParApkWeek", function(req, res){
    console.log("PersonneParApk page");
    res.render("o33_Week_PersonneParApk",
        {listPersonneParApkMois: listPersonneParApkMois,
            ListApplication: ListApplication,
            ListPersonne: ListPersonne,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9});
});



       // PersonneParMois

router.get("/PersonneParMois", function(req, res){
    console.log("PersonneParMois page");
    res.render("o4_PersonneParMois",
        {listPersonneParApkMois: listPersonneParApkMois,
            ListApplication: ListApplication,
            ListPersonne: ListPersonne,
            listAvenant: listAvenant,
            commande_vendu_m1: commande_vendu_m1,
            commande_vendu_m2: commande_vendu_m2,
            commande_vendu_m9: commande_vendu_m9 });
});
router.post("/PersonneParMois", function(req, res){
    console.log("PersonneParMois refresh");
    res.render("o4_PersonneParMois",
        {listPersonneParApkMois: listPersonneParApkMois,
            ListApplication: ListApplication,
            ListPersonne: ListPersonne});
});

//---> per week
router.get("/PersonneParMoisWeek", function(req, res){
    console.log("PersonneParMois page");
    res.render("o44_Week_PersonneParMois",
        {listPersonneParApkMois: listPersonneParApkMois,
            ListApplication: ListApplication,
            ListPersonne: ListPersonne });
});



//TMA
router.get("/TMA", function(req, res){
    console.log("TMA page");
    res.render("o5_TMA", {
        listTMA: listTMA,
        listEquipeTMA: listEquipeTMA,
        Applications_vendues: Applications_vendues,
        commande_tma_vendu: commande_tma_vendu,
        ticket_count: ticket_count
    });
});
router.post("/TMA", function(req, res){
    console.log("TMA refresh");
    res.render("o5_TMA", {
        listTMA: listTMA ,
        listEquipeTMA: listEquipeTMA,
        Applications_vendues: Applications_vendues,
        commande_tma_vendu: commande_tma_vendu,
        ticket_count : ticket_count
    });
});

//------------------> per week
router.get("/TMAWeek", function(req, res){
    console.log("TMA week page");
    res.render("o55_Week_TMA", {
        listTMA: listTMA,
        listEquipeTMA: listEquipeTMA,
        Applications_vendues: Applications_vendues,
        commande_tma_vendu: commande_tma_vendu,
        ticket_count: ticket_count
    });
});


//TMA2 (Applications / Services
router.get("/TMA2", function(req, res){
    console.log("TMA page");
    res.render("o6_TMA(ApplicationsParService)", {
        listTMA: listTMA,
        Applications_vendues: Applications_vendues,
        commande_tma_vendu: commande_tma_vendu,
        ticket_count: ticket_count
    });
});
router.post("/TMA2", function(req, res){
    console.log("TMA2 refresh");
    res.render("o6_TMA(ApplicationsParService)", {
        listTMA: listTMA ,
        Applications_vendues: Applications_vendues,
        commande_tma_vendu: commande_tma_vendu,
        ticket_count : ticket_count
    });
});

//------------------> per week
router.get("/TMA2Week", function(req, res){
    console.log("TMA2 week page");
    res.render("o66_Week_TMA(ApplicationsParService)", {
        listTMA: listTMA,
        Applications_vendues: Applications_vendues,
        commande_tma_vendu: commande_tma_vendu,
        ticket_count: ticket_count
    });
});


//Ditribution effort kpi
router.get("/global", function(req, res){
    console.log("global page");
    res.render("o7_Global", {
        listServiceParApkMois: listServiceParApkMois,
        listTMA: listTMA ,
        listHorsProd: listHorsProd,
        listIssues: listIssues ,
        listStation: listStation
    });
});
router.post("/global", function(req, res){
    console.log("TMA2 refresh");
    res.render("o7_Global", {
        listServiceParApkMois: listServiceParApkMois,
        listTMA: listTMA ,
        listHorsProd: listHorsProd,
        listIssues: listIssues ,
        listStation: listStation
    });
});

//------------------> per week
router.get("/globalWeek", function(req, res){
    console.log("global week page");
    res.render("o77_Week_Global", {
        listServiceParApkMois: listServiceParApkMois,
        listTMA: listTMA ,
        listHorsProd: listHorsProd,
        listIssues: listIssues ,
        listStation: listStation
    });
});

module.exports = router;
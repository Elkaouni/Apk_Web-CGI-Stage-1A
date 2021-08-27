
let listServiceParApkMois ;
let listPersonneParApkMois ;
let ListApplication ;
let ListPersonne ;

let listTMA, listEquipeTMA;

let listHORSPROD, listIssues;

let listStation;

let ListApplication_config;
let commande_brut_m1;
let commande_brut_m2;
let commande_brut_m9;

let commande_vendu_m1;
let commande_vendu_m2;
let commande_vendu_m9;
let commande_tma_vendu;
let Applications_vendues;
let ticket_count;
let listAvenant;


const oracledb = require('oracledb');
const dbConfig = require('./configs/dbConfig');

async function run(posts) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nrun; Successfully connected to Oracle Database");
        try{
            const query='DELETE FROM EXTRACT_TOTAL_129';
            await connection.execute(query,[], { autoCommit: true });
            console.log("EXTRACT_TOTAL_129 reset");
        }catch{
            console.log("delete failed.");
        }

        console.log("saving in EXTRACT_TOTAL_129 ");
        for(var i=0; i<posts.length; i++){
            var post= posts[i];
            try{
                connection.execute('insert into EXTRACT_TOTAL_129 ' +
                    'values(:Period_Start, :Year, :Month, :WORK_LOGGED_BY, :ISSUE, :ISSUE_TYPE, ' +
                    ':EXTERNAL_TICKET_ID, :Select_List_1, :Select_List_3, :Application_Name, ' +
                    ':Parent_Key, :Effort, :Estimated_Effort, :Hours, :nb_Issues, :Day, :Resolution_Progress)',
                    post, { autoCommit: true });
            }
            catch(err){
                console.log(err);
                console.log("insert with post and : failed");
            }
        }

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select SELECT_LIST_1 as SERVICE, APPLICATION_NAME as APPLICATION, SELECT_LIST_3,  Month, DAY, YEAR, sum(HOURS)/8 as IMPUTATION from EXTRACT_TOTAL_129 group by SELECT_LIST_1, MONTH, APPLICATION_NAME,SELECT_LIST_3, DAY, YEAR order by SELECT_LIST_1, MONTH, APPLICATION_NAME, DAY";
            var sql2 = "select WORK_LOGGED_BY as WORK_LOGGED, substr(SELECT_LIST_1,0,2) as SERVICE, Month, DAY, YEAR, APPLICATION_NAME as APPLICATION, SELECT_LIST_3, sum(HOURS)/8 as IMPUTATION from EXTRACT_TOTAL_129   group by WORK_LOGGED_BY, SELECT_LIST_1, APPLICATION_NAME, Month, SELECT_LIST_3, DAY, YEAR order by WORK_LOGGED_BY, SERVICE, Month, DAY";
            var sql3 = "select APPLICATION_NAME from EXTRACT_TOTAL_129 group by APPLICATION_NAME order by APPLICATION_NAME";
            var sql4 = "select WORK_LOGGED_BY as WORK_LOGGED from EXTRACT_TOTAL_129 group by WORK_LOGGED_BY order by WORK_LOGGED_BY";

            var queryServiceParApkMois = await connection.execute(
                sql1, []);
            var queryPersonneParApkMois = await connection.execute(
                sql2, []);
            var queryListApplication129 = await connection.execute(
                sql3, []);
            var queryListPersonne = await connection.execute(
                sql4, []);


            listServiceParApkMois = await queryServiceParApkMois.rows;
            listPersonneParApkMois = await queryPersonneParApkMois.rows;
            ListApplication = await queryListApplication129.rows;
            ListPersonne = await queryListPersonne.rows;

            module.exports.listServiceParApkMois = listServiceParApkMois ;
            module.exports.listPersonneParApkMois = listPersonneParApkMois ;
            module.exports.ListApplication = ListApplication ;
            module.exports.ListPersonne = ListPersonne ;

            console.log('select queries done successfully');

        }
        catch(err){
            console.log(err);
            console.log("select query : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.run =run;

async function get_m129() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nget_m129: Successfully connected to Oracle Database");
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select SELECT_LIST_1 as SERVICE, APPLICATION_NAME as APPLICATION,  MONTH, DAY, YEAR, SELECT_LIST_3,sum(HOURS)/8 as IMPUTATION from EXTRACT_TOTAL_129 group by SELECT_LIST_1, Month, DAY, APPLICATION_NAME, SELECT_LIST_3, YEAR order by MONTH, SELECT_LIST_1, APPLICATION_NAME, DAY";
            var sql2 = "select WORK_LOGGED_BY as WORK_LOGGED, substr(SELECT_LIST_1,0,2) as SERVICE,MONTH, DAY, YEAR, SELECT_LIST_3,  APPLICATION_NAME as APPLICATION, sum(HOURS)/8 as IMPUTATION from EXTRACT_TOTAL_129   group by MONTH,WORK_LOGGED_BY, SELECT_LIST_1, APPLICATION_NAME, PERIOD_START, SELECT_LIST_3, DAY, YEAR order by MONTH,WORK_LOGGED_BY, SERVICE, DAY";
            var sql3 = "select APPLICATION_NAME from EXTRACT_TOTAL_129 group by APPLICATION_NAME order by APPLICATION_NAME";
            var sql4 = "select WORK_LOGGED_BY as WORK_LOGGED from EXTRACT_TOTAL_129 group by WORK_LOGGED_BY order by WORK_LOGGED_BY";

            var queryServiceParApkMois = await connection.execute(
                sql1, []);
            var queryPersonneParApkMois = await connection.execute(
                sql2, []);
            var queryListApplication129 = await connection.execute(
                sql3, []);
            var queryListPersonne = await connection.execute(
                sql4, []);
            
            listServiceParApkMois = await queryServiceParApkMois.rows;
            listPersonneParApkMois = await queryPersonneParApkMois.rows;
            ListApplication = await queryListApplication129.rows;
            ListPersonne = await queryListPersonne.rows;


            module.exports.listServiceParApkMois = listServiceParApkMois ;
            module.exports.listPersonneParApkMois = listPersonneParApkMois ;
            module.exports.ListApplication = ListApplication ;
            module.exports.ListPersonne = ListPersonne ;

            console.log('select queries done successfully');

        }
        catch(err){
            console.log(err);
            console.log("select query : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.get_m129 =get_m129;

async function run_tma(tma_posts) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nrun_tma; Successfully connected to Oracle Database");
        try{
            const query='DELETE FROM EXTRACT_TOTAL_TMA';
            await connection.execute(query,[], { autoCommit: true });
            console.log("EXTRACT_TOTAL_TMA reset");
        }catch{
            console.log("delete failed.");
        }

        console.log("saving in EXTRACT_TOTAL_TMA ");
        for(var i=0; i<tma_posts.length; i++){
            var post= tma_posts[i];
            try{
                connection.execute('insert into EXTRACT_TOTAL_TMA ' +
                    'values(:Period_Start, :Year, :Month, :WORK_LOGGED_BY, :ISSUE, :ISSUE_TYPE, ' +
                    ':EXTERNAL_TICKET_ID, :Select_List_1, :Select_List_3, :Application_Name, ' +
                    ':Parent_Key, :Effort, :Estimated_Effort, :Hours, :nb_Issues, :Day, :Resolution_Progress)',
                    post, { autoCommit: true });
                console.log('post--> '+ i+' <-- Inserted in EXTRACT_TOTAL_TMA');
            }
            catch(err){
                console.log(err);
                console.log("insert with post and : failed");
            }
        }

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select * from EXTRACT_TOTAL_TMA where SELECT_LIST_1 in ('M3','M4','M5','M6','M7','M8','M10','M11','M12') and SELECT_LIST_3 in ('Lot 1', 'Lot 5') order by MONTH ";
            var sql2 = "select WORK_LOGGED_BY from EXTRACT_TOTAL_TMA where SELECT_LIST_3 in ('Lot 1', 'Lot 5') group by WORK_LOGGED_BY order by WORK_LOGGED_BY";

            var querylistTMA = await connection.execute(sql1, []);
            var queryEquipeTMA = await connection.execute(sql2, []);

            listTMA = await querylistTMA.rows;
            listEquipeTMA = await queryEquipeTMA.rows;

            module.exports.listTMA = listTMA ;
            module.exports.listEquipeTMA = listEquipeTMA ;
 
            console.log('select tma done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select query : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }     
}
module.exports.run_tma =run_tma;

async function get_tma(){
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nrun_tma: Successfully connected to Oracle Database");
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select * from EXTRACT_TOTAL_TMA where SELECT_LIST_1 in ('M3','M4','M5','M6','M7','M8','M10','M11','M12') and  SELECT_LIST_3 in ('Lot 1', 'Lot 5') order by MONTH, WORK_LOGGED_BY ";
            var sql2 = "select WORK_LOGGED_BY from EXTRACT_TOTAL_TMA where SELECT_LIST_3 in ('Lot 1', 'Lot 3') group by WORK_LOGGED_BY order by WORK_LOGGED_BY";

            var querylistTMA = await connection.execute(sql1, []);
            var queryEquipeTMA = await connection.execute(sql2, []);

            listTMA = await querylistTMA.rows;
            listEquipeTMA = await queryEquipeTMA.rows;

            module.exports.listTMA = listTMA ;
            module.exports.listEquipeTMA = listEquipeTMA ;
            /*console.log(listTMA[1]);
            console.log(listEquipeTMA[1]); */

            console.log('select tma done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select query : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.get_tma =get_tma;

async function run_horsprod(horsprod_posts) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nrun_horsprod; Successfully connected to Oracle Database");
        try{
            const query='DELETE FROM EXTRACT_TOTAL_HORSPROD';
            await connection.execute(query,[], { autoCommit: true });
            console.log("EXTRACT_TOTAL_HORSPROD reset");
        }catch{
            console.log("delete failed.");
        }

        console.log("saving in EXTRACT_TOTAL_HORSPROD ");
        for(var i=0; i<horsprod_posts.length; i++){
            var post= horsprod_posts[i];
            try{
                connection.execute('insert into EXTRACT_TOTAL_HORSPROD ' +
                    'values(:Period_Start, :Year, :Month, :WORK_LOGGED_BY, :ISSUE, :ISSUE_TYPE, ' +
                    ':EXTERNAL_TICKET_ID, :Select_List_1, :Select_List_3, :Application_Name, ' +
                    ':Parent_Key, :Effort, :Estimated_Effort, :Hours, :nb_Issues, :Day, :Resolution_Progress)',
                    post, { autoCommit: true });
                //console.log('post--> '+ i+' <-- Inserted in EXTRACT_TOTAL_TMA');
            }
            catch(err){
                console.log(err);
                console.log("insert with post and : failed");
            }
        }

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select * from EXTRACT_TOTAL_HORSPROD ";
            var sql2 = "select SELECT_LIST_1 from EXTRACT_TOTAL_HORSPROD group by SELECT_LIST_1 order by SELECT_LIST_1"

            var querylist = await connection.execute(sql1, []);
            var query = await connection.execute(sql2, []);

            listHORSPROD = await querylist.rows;
            listIssues = await query.rows;

            module.exports.listHORSPROD = listHORSPROD ;
            module.exports.listIssues = listIssues ;

            console.log('select horsprod done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select query : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.run_horsprod =run_horsprod;

async function get_horsprod() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nget hp; Successfully connected to Oracle Database");

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select * from EXTRACT_TOTAL_HORSPROD ";
            var sql2 = "select SELECT_LIST_1 from EXTRACT_TOTAL_HORSPROD group by SELECT_LIST_1 order by SELECT_LIST_1"

            var querylist = await connection.execute(sql1, []);
            var queryIssues = await connection.execute(sql2, []);

            listHORSPROD = await querylist.rows;
            listIssues = await queryIssues.rows;

            module.exports.listHORSPROD = listHORSPROD ;
            module.exports.listIssues = listIssues ;

            console.log('select horsprod done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select query : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.get_horsprod =get_horsprod;

async function get_station() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nget stationp; Successfully connected to Oracle Database");

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select * from EXTRACT_TOTAL_HORSPROD where SELECT_LIST_3 = 'SI STATION' ";
            var sql2 = "select * from EXTRACT_TOTAL_TMA where SELECT_LIST_3 = 'SI STATION' ";
            var sql3 = "select * from EXTRACT_TOTAL_129 where SELECT_LIST_3 = 'SI STATION' ";

            var querylist1 = await connection.execute(sql1, []);
            var querylist2 = await connection.execute(sql2, []);
            var querylist3 = await connection.execute(sql3, []);

            var list1 = await querylist1.rows;
            var list2 = await querylist2.rows;
            var list3 = await querylist3.rows;

            listStation = list1.concat(list2,list3);
            module.exports.listStation = listStation ;

            console.log('select horsprod done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select query : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.get_station = get_station;


async function set_config(commandes) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nset_config: Successfully connected to Oracle Database");
        try{
            const query='DELETE FROM CONFIG';
            await connection.execute(query,[], { autoCommit: true });
            console.log("config_table reset");
            await connection.execute('DELETE FROM COMMANDE_VENDU',[], { autoCommit: true });
            console.log("commande vendu_table reset");
        }catch{
            console.log("delete failed.");
        }

        console.log("saving in config_table... ");
        for(var i=0; i<commandes.length; i++) {
            var post = commandes[i];
            try {
             //   console.log("post " + i + " to insert --> " + JSON.stringify(post));
                connection.execute('insert into CONFIG(APPLICATIONS, M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12) values' +
                    '(:Application, :m1, :m2, :m3, :m4, :m5, :m6, :m7, :m8, :m9, :m10, :m11, :m12)',
                    post, {autoCommit: true});
              //  console.log('post Inserted in config test');
            } catch (err) {
                console.log(err);
                console.log("insert failed\n");
            }
        }

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select APPLICATIONS, M1 from CONFIG order by APPLICATIONS";
            var sql2 = "select APPLICATIONS, M2 from CONFIG order by APPLICATIONS";
            var sql9 = "select APPLICATIONS, M9 from CONFIG order by APPLICATIONS";
            var sql4 = "select APPLICATIONS from CONFIG order by APPLICATIONS";

            var queryCommande_brut_m1 = await connection.execute(sql1, []);
            var queryCommande_brut_m2 = await connection.execute(sql2, []);
            var queryCommande_brut_m9 = await connection.execute(sql9, []);
            var queryListApplication = await connection.execute(sql4, []);

            commande_brut_m1 = await queryCommande_brut_m1.rows;
            commande_brut_m2 = await queryCommande_brut_m2.rows;
            commande_brut_m9 = await queryCommande_brut_m9.rows;
            ListApplication_config = await queryListApplication.rows;


            module.exports.commande_brut_m1 = commande_brut_m1 ;
            module.exports.commande_brut_m2 = commande_brut_m2 ;
            module.exports.commande_brut_m9 = commande_brut_m9 ;
            module.exports.ListApplication_config = ListApplication_config ;

            console.log('select config test done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select Mquery : failed");
        }


    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.set_config = set_config;

async function get_commande_brut() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nget_commande_brut: Successfully connected to Oracle Database");
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select APPLICATIONS, M1 from CONFIG order by APPLICATIONS";
            var sql2 = "select APPLICATIONS, M2 from CONFIG order by APPLICATIONS";
            var sql9 = "select APPLICATIONS, M9 from CONFIG order by APPLICATIONS";
            var sql4 = "select APPLICATIONS from CONFIG order by APPLICATIONS";

            var queryCommande_brut_m1 = await connection.execute(sql1, []);
            var queryCommande_brut_m2 = await connection.execute(sql2, []);
            var queryCommande_brut_m9 = await connection.execute(sql9, []);
            var queryListApplication = await connection.execute(sql9, []);

            commande_brut_m1 = await queryCommande_brut_m1.rows;
            commande_brut_m2 = await queryCommande_brut_m2.rows;
            commande_brut_m9 = await queryCommande_brut_m9.rows;
            ListApplication_config = await queryListApplication.rows;

            module.exports.commande_brut_m1 = commande_brut_m1 ;
            module.exports.commande_brut_m2 = commande_brut_m2 ;
            module.exports.commande_brut_m9 = commande_brut_m9 ;
            module.exports.ListApplication_config = ListApplication_config ;

            console.log('select get_commande_brut done successfully');

        }
        catch(err){
            console.log(err);
            console.log("select get_commande_brut : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.get_commande_brut = get_commande_brut;

async function get_commande_vendu() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nget_commande_vendu: Successfully connected to Oracle Database");
        try{
            console.log('select queries'); //with test_table
            var sql1 = "select APPLICATIONS, M1 from COMMANDE_VENDU where not (m1 =0 and m2= 0 and m9 =0) order by APPLICATIONS";
            var sql2 = "select APPLICATIONS, M2 from COMMANDE_VENDU where not (m1 =0 and m2= 0 and m9 =0) order by APPLICATIONS";
            var sql9 = "select APPLICATIONS, M9 from COMMANDE_VENDU where not (m1 =0 and m2= 0 and m9 =0) order by APPLICATIONS";
            var sqlApk = "select APPLICATION_NAME from EXTRACT_TOTAL_TMA where SELECT_LIST_3 in ('Lot 1', 'Lot 3') group by APPLICATION_NAME order by APPLICATION_NAME";
            var sqlTMA = "select APPLICATIONS, M3, M4, M5, M6, M7, M8, M10 ,M11, M12 from COMMANDE_VENDU where not (m6 =0 and m7 =0) order by APPLICATIONS";
            var sqlTickets = "select WORK_LOGGED_BY, SELECT_LIST_1 as service, MONTH, DAY, YEAR, APPLICATION_NAME, RESOLUTION_PROGRESS, ISSUE from EXTRACT_TOTAL_TMA where SELECT_LIST_3 in ('Lot 1', 'Lot 3') order by WORK_LOGGED_BY, SELECT_LIST_1, MONTH, DAY, ISSUE";

            var queryCommande_vendu_m1 = await connection.execute(sql1, []);
            var queryCommande_vendu_m2 = await connection.execute(sql2, []);
            var queryCommande_vendu_m9 = await connection.execute(sql9, []);
            var queryApkVendu = await connection.execute(sqlApk, []);
            var queryApkTMA = await connection.execute(sqlTMA, []);
            var queryTicketsCount = await connection.execute(sqlTickets, []);

            commande_vendu_m1 = await queryCommande_vendu_m1.rows;
            commande_vendu_m2 = await queryCommande_vendu_m2.rows;
            commande_vendu_m9 = await queryCommande_vendu_m9.rows;
            Applications_vendues = await queryApkVendu.rows;
            commande_tma_vendu = await queryApkTMA.rows;
            ticket_count = await queryTicketsCount.rows;

            module.exports.commande_vendu_m1 = commande_vendu_m1 ;
            module.exports.commande_vendu_m2 = commande_vendu_m2 ;
            module.exports.commande_vendu_m9 = commande_vendu_m9 ;
            module.exports.commande_tma_vendu = commande_tma_vendu ;
            module.exports.Applications_vendues = Applications_vendues ;
            module.exports.ticket_count = ticket_count;

            console.log('select Mqueries done successfully');

        }
        catch(err){
            console.log(err);
            console.log("select Mquery : failed");
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.get_commande_vendu = get_commande_vendu;

async function set_vendu(commandes){
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig) ;
        console.log("\nset_vendu: Successfully connected to Oracle Database");

        try{
            let query = 'DELETE FROM COMMANDE_VENDU';
            await connection.execute(query,[], { autoCommit: true });
            console.log("commande vendu_table reset");
        }catch{
            console.log("delete failed.");
        }

        for (var i = 0; i < commandes.length; i++) {
            try {
                var vendu = commandes[i];
                vendu.m1 = (vendu.m1 - 0.037 * vendu.m1) / 393.02;
                vendu.m2 = (vendu.m2 - 0.037 * vendu.m2) / 393.02;
                vendu.m9 = (vendu.m9 - 0.037 * vendu.m9) / 393.02;

                connection.execute('insert into COMMANDE_VENDU(APPLICATIONS, M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12) values' +
                    '(:Application, :m1, :m2, :m3, :m4, :m5, :m6, :m7, :m8, :m9, :m10, :m11, :m12)',
                    vendu, {autoCommit: true});
            } catch (err) {
                console.log(err);
            }
        }

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('let s check select commande vendu test');
            var sql1_vendu = "select APPLICATIONS, M1 from COMMANDE_VENDU order by APPLICATIONS";
            var sql2_vendu = "select APPLICATIONS, M2 from COMMANDE_VENDU order by APPLICATIONS";
            var sql9_vendu = "select APPLICATIONS, M9 from COMMANDE_VENDU order by APPLICATIONS";

            var queryCommande_vendu_m1 = await connection.execute(sql1_vendu, []);
            var queryCommande_vendu_m2 = await connection.execute(sql2_vendu, []);
            var queryCommande_vendu_m9 = await connection.execute(sql9_vendu, []);

            commande_vendu_m1 = await queryCommande_vendu_m1.rows;
            commande_vendu_m2 = await queryCommande_vendu_m2.rows;
            commande_vendu_m9 = await queryCommande_vendu_m9.rows;

            /* console.log("commande_m1  ---"+JSON.stringify(commande_vendu_m1));
             console.log("commande_m2  ---"+JSON.stringify(commande_vendu_m2));
             console.log("commande_m9  ---"+JSON.stringify(commande_vendu_m9));
             */
            module.exports.commande_m1_vendu = commande_vendu_m1 ;
            module.exports.commande_m2_vendu = commande_vendu_m2 ;
            module.exports.commande_m9_vendu = commande_vendu_m9 ;

            console.log('select config vendu test done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select Mquery : failed");
        }
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.set_vendu = set_vendu;

async function set_avenants(avenants) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig)
        console.log("\nset_config: Successfully connected to Oracle Database");
        try{
            const query='DELETE FROM CONFIG_AVENANTS';
            await connection.execute(query,[], { autoCommit: true });
            console.log("CONFIG_AVENANTS reset");
        }catch{
            console.log("delete failed.");
        }

        console.log("saving in CONFIG_AVENANTS... ");
        for(var i=0; i<avenants.length; i++) {
            var post = avenants[i];
            try {
                //   console.log("post " + i + " to insert --> " + JSON.stringify(post));
                connection.execute('insert into CONFIG_AVENANTS(APPLICATIONS, DEBUT, FIN, M1, M2, M9) values' +
                    '(:Application, :Debut, :Fin, :m1, :m2, :m9)',
                    post, {autoCommit: true});
                //  console.log('post Inserted in config test');
            } catch (err) {
                console.log(err);
                console.log("insert failed\n");
            }
        }

        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql = "select * from CONFIG_AVENANTS order by APPLICATIONS";
            var query = await connection.execute(sql, []);
            listAvenant = await query.rows;
            module.exports.listAvenant = listAvenant ;

            console.log('select CONFIG_AVENANTS done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select Mquery : failed");
        }


    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.set_avenants = set_avenants;

async function get_avenants(){
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig) ;
        console.log("\nget_avenants: Successfully connected to Oracle Database");
        oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
        try{
            console.log('select queries'); //with test_table
            var sql = "select * from CONFIG_AVENANTS order by APPLICATIONS";
            var query = await connection.execute(sql, []);
            listAvenant = await query.rows;
            module.exports.listAvenant = listAvenant ;

            console.log('select CONFIG_AVENANTS done successfully');
        }
        catch(err){
            console.log(err);
            console.log("select Mquery : failed");
        }
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                console.log("Connection closed.");
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.get_avenants = get_avenants;

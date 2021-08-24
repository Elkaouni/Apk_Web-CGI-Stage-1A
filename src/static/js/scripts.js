let error = document.getElementById("error").innerText;
let error_message =document.getElementById("error_message");
error_message.innerHTML = '';
var i=0;
for(var k=0; k<3; k++){
    let txt = error.substr(i, error.length);
    var saut = txt.indexOf('.');
    let text = txt.substr(0,saut+1);
    i= i+saut+1;

    error_message.innerHTML += text + "<br>";
}

function tips(){
    var width = 900;
    var height = 430;
    var left = (screen.width )/2 -width/2;
    var top = (screen.height )/2 -height/2;
    var myWindow = window.open("", "Conseils d'utilisation", 'width='+width+',height='+height+', top='+top+', left='+left);
    myWindow.document.write("<style>" +
        "body{" +
        "font-family:'Arial', sans-serif;" +
        "font-size: 13px;" +
        "text-align: center;" +
        "background: #dad9d9;" +
        "text-align-all: center;" +
        "}" +
        ".exemple table,.exemple th, .exemple td{" +
        "border: 1px solid;" +
        "padding: 3px;" +
        "font-size: 9px; " +
        "}" +
        ".exemple table{" +
        "border: 1px solid;" +
        "border-collapse: collapse;" +
        "width: 90%;" +
        "}" +
        ".exemple thead{ background: rgba(255, 200, 200, 0.85); }" +
        ".exemple tbody{ background: white; }" +
        "table{  margin: 0 auto; }" +
        ".conseils p{ font-size: 12px;  }" +
        "</style>");

    myWindow.document.write("<p>Veuillez vous assurer que les extracts téléchargés ont la forme suivante:</p>");
    myWindow.document.write("<p style='font-weight: bold;'>Pour l'extracts des imputations:</p>");
    myWindow.document.write("<table class='exemple'>" +
        "<thead>" +
        "<tr>" +
        "<th>Period Start (ou Date)</th> <th>Year</th> <th>Month</th> <th>Day</th> <th>Work Logged By</th>  <th>Issue</th>" +
        " <th>Issue Type</th>  <th>External Ticket ID</th>  <th>Select List 1</th> " +
        " <th>Select List 3</th>   <th>Application Name</th>  <th>Parent Key</th>" +
        " <th>Resolution Progress</th>  <th>Effort</th>  <th>Estimated Effort</th> <th>Hours</th>" +
        " <th># of Issues</th>" +
        " </tr>" +
        "</thead>" +
        " <tbody>" +
        "  <tr>" +
        "<td></td><td></td><td><td></td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>" +
        "<td></td><td></td><td></td><td></td><td></td><td></td>" +
        " </tr>" +
        " </tbody>" +
        " </table>");
    myWindow.document.write("<p style='font-weight: bold;'>Pour la commande annuelle (€) et les avenants:</p>");
    myWindow.document.write("<p>La première feuille du fichier excel doit contenir les informations " +
        "sur la commande annuelle suivant cet exemple:</p>");
    myWindow.document.write("<table class='exemple'> <thead>  <tr>" +
        " <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th> " +
        "<th>M1</th> <th>M2</th>  <th>M3</th>  <th>M4</th> <th>M5</th> <th>M6</th>" +
        "<th>M7</th>  <th>M8</th>  <th>M9</th>  <th>M10</th> <th>M11</th>" +
        " </tr>" +
        " </thead>" +
        "<tbody>  <tr>" +
        "<td>*Application X </td>  <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>" +
        " <td></td> <td></td> <td></td> <td></td> <td></td>" +
        " </tr>" +
        " </tbody>" +
        "</table>");
    myWindow.document.write("<p>La deuxième feuille du fichier excel doit contenir les informations " +
        "sur les avenants suivant cet exemple:</p>");
    myWindow.document.write("<table class='exemple'> " +
        "<thead>  " +
        "<tr>" +
        " <th></th> " +
        "<th>Mois début</th> <th>Mois fin</th>  <th>M1</th>  <th>M2</th> <th>M9</th>" +
        " </tr>" +
        " </thead>" +
        "<tbody>  " +
        "<tr>" +
        "<td>*Application X</td>  " +
        "<td>(entier entre 1 et 12)</td> <td>(entier entre 1 et 12)</td> " +
        "<td></td> <td></td> <td></td>" +
        " </tr>" +
        " </tbody>" +
        "</table>");
    myWindow.document.write("<p style='color:#5f0000;'>(*)Veuillez vous assurer que les noms des applications sont les mêmes dans les deux extracts.</p>");
    myWindow.document.write("<button onclick='self.close()'>J'ai compris</button>");
}

function tips_config(){
    var width = 750;
    var height = 300;
    var left = (screen.width )/2 -width/2;
    var top = (screen.height )/2 -height/2;
    var myWindow = window.open("", "Conseils d'utilisation", 'width='+width+',height='+height+', top='+top+', left='+left);
    myWindow.document.write("<style>" +
        "body{" +
        "font-family:'Arial', sans-serif;" +
        "font-size: 13px;" +
        "text-align: center;" +
        "background: #dad9d9;" +
        "text-align-all: center;" +
        "}" +
        ".exemple table,.exemple th, .exemple td{" +
        "border: 1px solid;" +
        "padding: 3px;" +
        "font-size: 9px; " +
        "}" +
        ".exemple table{" +
        "border: 1px solid;" +
        "border-collapse: collapse;" +
        "width: 90%;" +
        "}" +
        ".exemple thead{ background: rgba(255, 200, 200, 0.85); }" +
        ".exemple tbody{ background: white; }" +
        "table{  margin: 0 auto; }" +
        ".conseils p{ font-size: 12px;  }" +
        "</style>");

    myWindow.document.write("<p style='font-weight: bold;'>Veuillez vous assurer que l' extract téléchargé à la forme suivante:</p>");
    myWindow.document.write("<p>La première feuille du fichier excel doit contenir les informations " +
        "sur la commande annuelle suivant cet exemple:</p>");
    myWindow.document.write("<table class='exemple'> <thead>  <tr>" +
        " <th></th> " +
        "<th>M1</th> <th>M2</th>  <th>M3</th>  <th>M4</th> <th>M5</th> <th>M6</th>" +
        "<th>M7</th>  <th>M8</th>  <th>M9</th>  <th>M10</th> <th>M11</th>" +
        " </tr>" +
        " </thead>" +
        "<tbody>  <tr>" +
        "<td>*Application X </td>  <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>" +
        " <td></td> <td></td> <td></td> <td></td> <td></td>" +
        " </tr>" +
        " </tbody>" +
        "</table>");
    myWindow.document.write("<p>La deuxième feuille du fichier excel doit contenir les informations " +
        "sur les avenants suivant cet exemple:</p>");
    myWindow.document.write("<table class='exemple'> " +
        "<thead>  " +
        "<tr>" +
        " <th></th> " +
        "<th>Mois début</th> <th>Mois fin</th>  <th>M1</th>  <th>M2</th> <th>M9</th>" +
        " </tr>" +
        " </thead>" +
        "<tbody>  " +
        "<tr>" +
        "<td>*Application X</td>  " +
        "<td>(entier entre 1 et 12)</td> <td>(entier entre 1 et 12)</td> " +
        "<td></td> <td></td> <td></td>" +
        " </tr>" +
        " </tbody>" +
        "</table>");
    myWindow.document.write("<p style='color:#5f0000;'>(*)Veuillez vous assurer que les noms des applications sont les mêmes dans les deux extracts.</p>");
    myWindow.document.write("<button onclick='self.close()'>J'ai compris</button>");
}

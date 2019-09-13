/* global System, xhr, myarray, google, json, drawChart */
var access_token;
var userId;
var url;
var xhr;
var daterange;
var fooddaterange;
var querydate;
var date;
var fooddr;
      
window.onload = function(){
// get the url
url = window.location.href;
//getting the access token from url
access_token = url.split("#")[1].split("=")[1].split("&")[0];
// get the userid
userId = url.split("#")[1].split("=")[2].split("&")[0];
console.log("token: " + access_token);
console.log("user: " + userId);

getall();
};

window.onbeforeunload = revoketoken();

function getall () {
gettoken();
getloggedin();      //Browser-Session Data
getdaterange();     //Browser-Date Components
getuser();          //User
getsteps();         //Activity-Steps
getdistance();      //Activity-Distance
getheartrate();     //HeartRate
getcaloriesout();
getcaloriesin();       //Food Logginggetwaterlog();      //Food Logging
getwaterlog();
getfoodlog();       //Body & Weight
getsleep();         //Sleep
//getactivities();
//hideelement("");    //Utilities

};

function getloggedin(){
// get the url
url = window.location.href;
//getting the access token from url
access_token = url.split("#")[1].split("=")[1].split("&")[0];
// get the userid
userId = url.split("#")[1].split("=")[2].split("&")[0];    
console.log("Logged: " + userId);
};
//************************USER SERIES************************************************
function getuser (){
xhr_user = new XMLHttpRequest();
xhr_user.open('GET', 'https://api.fitbit.com/1/user/-/profile.json');
xhr_user.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_user.send();
xhr_user.onload = function() {   
   // document.getElementById('user').innerHTML = xhr_user.status;
   if (xhr_user.status === 200) {
        userdata = JSON.parse(xhr_user.responseText);
        age = userdata.user.age;
        fullname = userdata.user.fullName;
        height = ((userdata.user.height / 2.54)/12) ;
        height = Math.round(height*10)/10;        
        weight = userdata.user.weight*2.2046;
        weight = Math.round(weight);                
        document.getElementById('user').innerHTML = "Name: " + fullname;
        document.getElementById('age').innerHTML = "Age: " + age;
        document.getElementById('height').innerHTML = "Height: " + height;
        document.getElementById('weight').innerHTML = "Weight: " + weight;
        
      }
};
};      
//*************************ACTIVITY SERIES***********************************************
function getsteps (){
xhr_steps = new XMLHttpRequest();
xhr_steps.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/tracker/steps/date/today/' + querydate + '.json');
//xhr_steps.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/steps/date/today/' + querydate + '.json');
xhr_steps.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_steps.send();
xhr_steps.onload = function() {
   if (xhr_steps.status === 200) {
       json = JSON.parse(xhr_steps.responseText);
       //console.log("ReturnText: " + xhr_steps.responseText);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();
       data.addColumn('date', 'Date');
       data.addColumn('number', 'Steps');
       //Fill Data Table with Response Values
       for (i=0; i <json['activities-tracker-steps'].length; i++ ){
            //console.log( i + " Catch: " + new Date(json['activities-tracker-steps'][i].dateTime) + " " + json['activities-tracker-steps'][i].value);
            var thedate = json['activities-tracker-steps'][i].dateTime;
            dst = thedate.split("-");   dstmonth = new Number(dst[1]);    dstday = new Number(dst[2]);   dstyear= new Number(dst[0]);
            //console.log("Month " + dstmonth + " Day " + dstday + " Year " + dstyear);
            data.addRows(1);       
            //data.setCell(i,0, new Date(json['activities-tracker-steps'][i].dateTime)); 
            data.setCell(i,0, new Date(dstyear, dstmonth-1, dstday));
            data.setCell(i,1,(json['activities-tracker-steps'][i].value));
        }
       //Console Notes 
       console.log("data: " + data.length);
       console.log(JSON.stringify(data));
       //Charting Options
       var options = google.charts.Line.convertOptions({
            title: 'Steps by Date',
            height: 350,
            width: 900,
            curveType: 'function',
            animation: {startup: true,
                duration:200,
            easing: 'in'},
            pointsVisible: 'True',
            pointSize: 4,
        viewWindow: {min: 0, max: 15000},
            showTextEvery:1,scaleType: 'mirrorLog',
            vAxis: {"title":"Steps Taken"},
            hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        });
        //    
        //var chart = new google.charts.Line(document.getElementById('stepsgraph'));
        var chart = new google.visualization.LineChart(document.getElementById('stepsgraph'));
        chart.draw(data, options);
       //Update Browser
        var i;
        document.getElementById('steps').innerHTML = "";
        for (i=0; i <json['activities-tracker-steps'].length; i++ ){
            document.getElementById('steps').innerHTML = document.getElementById('steps').innerHTML + '\n' + json['activities-tracker-steps'][i].dateTime + " - " + json['activities-tracker-steps'][i].value + " steps | ";                   
        }                                     
    }                
};
};
//************************************************************************
function getdistance (){
xhr_dist = new XMLHttpRequest();
xhr_dist.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/tracker/distance/date/today/' + querydate + '.json');
xhr_dist.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_dist.send();
xhr_dist.onload = function() {
   if (xhr_dist.status === 200) {
       json = JSON.parse(xhr_dist.responseText);
       //console.log("ReturnText: " + xhr_steps.responseText);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();
       data.addColumn('date', 'Date');
       data.addColumn('number', 'Distance');
       //Fill Data Table with Response Values
       for (i=0; i <json['activities-tracker-distance'].length; i++ ){
            //console.log( i + " Catch: " + new Date(json['activities-tracker-distance'][i].dateTime) + " " + json['activities-tracker-distance'][i].value);
            var thedate = json['activities-tracker-distance'][i].dateTime;
            dst = thedate.split("-");   dstmonth = new Number(dst[1]);    dstday = new Number(dst[2]);   dstyear= new Number(dst[0]);
            //console.log("Month " + dstmonth + " Day " + dstday + " Year " + dstyear);
            data.addRows(1);       
            //data.setCell(i,0, new Date(json['activities-tracker-distance'][i].dateTime)); 
            data.setCell(i,0, new Date(dstyear, dstmonth-1, dstday));
            data.setCell(i,1,(json['activities-tracker-distance'][i].value));
        }
        //Console Notes 
       console.log("data: " + data.length);
       console.log(JSON.stringify(data));
       //Charting Options
       var options = google.charts.Line.convertOptions({
            title: 'Distance by Date',
            height: 350,
            width: 900,
            viewWindow: {min: 0, max: 15000},
            showTextEvery:1,scaleType: 'mirrorLog',
            vAxis: {"title":"Distance"},
            hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        });
        //    
        //var chart = new google.charts.Line(document.getElementById('stepsgraph'));
        var chart = new google.visualization.LineChart(document.getElementById('distancegraph'));
        chart.draw(data, options);
       //Update Browser
        var i;
        document.getElementById('distance').innerHTML = "";
        for (i=0; i <json['activities-tracker-distance'].length; i++ ){
            document.getElementById('distance').innerHTML = document.getElementById('distance').innerHTML + '\n' + json['activities-tracker-distance'][i].dateTime + " - " + json['activities-tracker-distance'][i].value + " distance | ";                   
        } 
      }
};
};
//************************************************************************
function getheartrate (){
xhr_hr = new XMLHttpRequest();
xhr_hr.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/heart/date/today/' + querydate + '.json');
xhr_hr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_hr.send();
xhr_hr.onload = function() {
   if (xhr_hr.status === 200) {
       json = JSON.parse(xhr_hr.responseText);
       console.log("ReturnText: " + xhr_hr.responseText);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();
       data.addColumn('date', 'Date');
       data.addColumn('number', 'Resting Heart Rate');
       
       
       //Fill Data Table with Response Values
       for (i=0; i <json['activities-heart'].length; i++ ){
            //console.log( i + " Catch: " + new Date(json['activities-tracker-distance'][i].dateTime) + " " + json['activities-tracker-distance'][i].value);
            var thedate = json['activities-heart'][i].dateTime;
            dst = thedate.split("-");   dstmonth = new Number(dst[1]);    dstday = new Number(dst[2]);   dstyear= new Number(dst[0]);
            //console.log("Month " + dstmonth + " Day " + dstday + " Year " + dstyear);
            data.addRows(1);       
            //data.setCell(i,0, new Date(json['activities-tracker-distance'][i].dateTime)); 
            data.setCell(i,0, new Date(dstyear, dstmonth-1, dstday));
            data.setCell(i,1,(json['activities-heart'][i].value.restingHeartRate));
            //data.setCell(i,1,(json['activities-heart'][i].value.restingHeartRate));            
        }
        
        //Console Notes 
       console.log("data: " + data.length);
       console.log(JSON.stringify(data));
       //Charting Options
       var options = google.charts.Line.convertOptions({
            title: 'Heart Rate',
            height: 350,
            width: 900,
            viewWindow: {min: 0, max: 15000},
            showTextEvery:1,scaleType: 'mirrorLog',
            vAxis: {"title":"Heart Rate", "minValue":25, "maxValue":120, "tick":5},
            hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        });
        //    
        //var chart = new google.charts.Line(document.getElementById('stepsgraph'));
        var chart = new google.visualization.LineChart(document.getElementById('heartrategraph'));
        chart.draw(data, options);
       //Update Browser
        var i;
        document.getElementById('heartrate').innerHTML = "";
        for (i=0; i <json['activities-heart'].length; i++ ){
            document.getElementById('heartrate').innerHTML = document.getElementById('heartrate').innerHTML + '\n' + json['activities-heart'][i].dateTime + " - " + json['activities-heart'][i].value.restingHeartRate + " heartrate | ";                   
        }
      }
};
};
//************************************************************************
function getbodyfat (){
xhr_bodyfat = new XMLHttpRequest();
xhr_bodyfat.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/body/bmi/date/6m.json');
xhr_bodyfat.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_bodyfat.send();
xhr_bodyfat.onload = function() {
   if (xhr_bodyfat.status === 200) {
      document.getElementById('bodyfat').innerHTML = xhr_bodyfat.responseText;
      }
};
};
//************************************************************************
function getcaloriesout(){
xhr_cal = new XMLHttpRequest();
xhr_cal.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/heart/date/today/' + querydate + '.json');
xhr_cal.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_cal.send();
xhr_cal.onload = function() {
   if (xhr_cal.status === 200) {
       json = JSON.parse(xhr_cal.responseText);
       console.log("ReturnText: " + xhr_cal.responseText);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();
       data.addColumn('date', 'Date');
       //data.addColumn('number', 'Resting Heart Rate');
       data.addColumn('number', 'Other');
       data.addColumn('number', 'Fat Burn');
       data.addColumn('number', 'Cardio');
       data.addColumn('number', 'Peak');
       //data.addColumn('number', 'Fat Burn');
       
       
       //Fill Data Table with Response Values
       for (i=0; i <json['activities-heart'].length; i++ ){
            //console.log( i + " Catch: " + new Date(json['activities-tracker-distance'][i].dateTime) + " " + json['activities-tracker-distance'][i].value);
            var thedate = json['activities-heart'][i].dateTime;
            dst = thedate.split("-");   dstmonth = new Number(dst[1]);    dstday = new Number(dst[2]);   dstyear= new Number(dst[0]);
            //console.log("Month " + dstmonth + " Day " + dstday + " Year " + dstyear);
            data.addRows(1);       
            //data.setCell(i,0, new Date(json['activities-tracker-distance'][i].dateTime)); 
            data.setCell(i,0, new Date(dstyear, dstmonth-1, dstday));
            //data.setCell(i,1,(json['activities-heart'][i].value.restingHeartRate));
            data.setCell(i,1,(json['activities-heart'][i].value.heartRateZones[0].caloriesOut));
            data.setCell(i,2,(json['activities-heart'][i].value.heartRateZones[1].caloriesOut));
            data.setCell(i,3,(json['activities-heart'][i].value.heartRateZones[2].caloriesOut));
            data.setCell(i,4,(json['activities-heart'][i].value.heartRateZones[3].caloriesOut));
            //data.setCell(i,1,(json['activities-heart'][i].value.restingHeartRate));            
        } 
        
        //Console Notes 
       console.log("data: " + data.length);
       console.log(JSON.stringify(data));
       //Charting Options
       var options = { //google.charts.Line.convertOptions({
            title: 'Calories Out',
            height: 350,
            width: 900,
            seriesType: 'bars',
            viewWindow: {min: 0, max: 15000},
            showTextEvery:1,scaleType: 'mirrorLog',
            vAxis: {"title":"Calories"},
            hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        }; //);
        //    
        //var chart = new google.charts.Line(document.getElementById('stepsgraph'));
        var chart = new google.visualization.ComboChart(document.getElementById('caloriegraph'));
        chart.draw(data, options);
       //Update Browser
        var i;
        document.getElementById('calories').innerHTML = "";
        for (i=0; i <json['activities-heart'].length; i++ ){
            document.getElementById('calories').innerHTML = document.getElementById('calories').innerHTML + '\n' + json['activities-heart'][i].dateTime + " - " + json['activities-heart'][i].value.restingHeartRate + " calories | ";                   
        }
      }
};
};


//************************************************************************
function getcaloriesin (){
xhr_caloriesin = new XMLHttpRequest();
xhr_caloriesin.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/foods/log/caloriesIn/date/today/' + querydate + '.json');
xhr_caloriesin.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_caloriesin.send();
xhr_caloriesin.onload = function() {
      if (xhr_caloriesin.status === 200) {
       json = JSON.parse(xhr_caloriesin.responseText);
       //console.log("ReturnText: " + xhr_steps.responseText);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();
       data.addColumn('date', 'Date');
       data.addColumn('number', 'Calories In');
       //Fill Data Table with Response Values
       for (i=0; i <json['foods-log-caloriesIn'].length; i++ ){
            //console.log( i + " Catch: " + new Date(json['activities-tracker-distance'][i].dateTime) + " " + json['activities-tracker-distance'][i].value);
            var thedate = json['foods-log-caloriesIn'][i].dateTime;
            dst = thedate.split("-");   dstmonth = new Number(dst[1]);    dstday = new Number(dst[2]);   dstyear= new Number(dst[0]);
            //console.log("Month " + dstmonth + " Day " + dstday + " Year " + dstyear);
            data.addRows(1);       
            //data.setCell(i,0, new Date(json['activities-tracker-distance'][i].dateTime)); 
            data.setCell(i,0, new Date(dstyear, dstmonth-1, dstday));
            data.setCell(i,1,(json['foods-log-caloriesIn'][i].value));
        }
        //Console Notes 
       console.log("data: " + data.length);
       console.log(JSON.stringify(data));
       //Charting Options
       var options = google.charts.Line.convertOptions({
            title: 'Caloric Intake by Date',
            height: 350,
            width: 900,
            viewWindow: {min: 0, max: 15000},
            showTextEvery:1,scaleType: 'mirrorLog',
            vAxis: {"title":"Calories In"},
            hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        });
        //    
        //var chart = new google.charts.Line(document.getElementById('stepsgraph'));
        var chart = new google.visualization.LineChart(document.getElementById('caloriesingraph'));
        chart.draw(data, options);
       //Update Browser
        var i;
        document.getElementById('caloriesin').innerHTML = "";
        for (i=0; i <json['foods-log-caloriesIn'].length; i++ ){
            document.getElementById('caloriesin').innerHTML = document.getElementById('caloriesin').innerHTML + '\n' + json['foods-log-caloriesIn'][i].dateTime + " - " + json['foods-log-caloriesIn'][i].value + " caloriesin | ";                   
        } 
      }
};
};

//************************************************************************
function getwaterlog (){
xhr_waterlog = new XMLHttpRequest();
xhr_waterlog.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/foods/log/water/date/today/' + querydate + '.json');
xhr_waterlog.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_waterlog.send();
xhr_waterlog.onload = function() {
   if (xhr_waterlog.status === 200) {
      json = JSON.parse(xhr_waterlog.responseText);
       console.log("ReturnText: " + xhr_waterlog.responseText);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();
       data.addColumn('date', 'Date');
       data.addColumn('number', 'Water');
       //Fill Data Table with Response Values
       for (i=0; i <json['foods-log-water'].length; i++ ){
            //console.log( i + " Catch: " + new Date(json['activities-tracker-steps'][i].dateTime) + " " + json['activities-tracker-steps'][i].value);
            var thedate = json['foods-log-water'][i].dateTime;
            dst = thedate.split("-");   dstmonth = new Number(dst[1]);    dstday = new Number(dst[2]);   dstyear= new Number(dst[0]);
            //console.log("Month " + dstmonth + " Day " + dstday + " Year " + dstyear);
            data.addRows(1);       
            //data.setCell(i,0, new Date(json['activities-tracker-steps'][i].dateTime)); 
            data.setCell(i,0, new Date(dstyear, dstmonth-1, dstday));
            data.setCell(i,1,(json['foods-log-water'][i].value));
        }
       //Console Notes 
       console.log("data: " + data.length);
       console.log(JSON.stringify(data));
       //Charting Options
       var options = { //google.charts.Line.convertOptions({
            title: 'Water Consumption',
            height: 350,
            width: 900,
            viewWindow: {min: 0, max: 15000},
            showTextEvery:1,scaleType: 'mirrorLog',
            vAxis: {"title":"Water"},
            hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        };
        //    
        //var chart = new google.charts.Line(document.getElementById('stepsgraph'));
        var chart = new google.visualization.AreaChart(document.getElementById('watergraph'));
        chart.draw(data, options);
       //Update Browser
        var i;
        document.getElementById('waterlog').innerHTML = "";
        for (i=0; i <json['foods-log-water'].length; i++ ){
            document.getElementById('waterlog').innerHTML = document.getElementById('waterlog').innerHTML + '\n' + json['foods-log-water'][i].dateTime + " - " + json['foods-log-water'][i].value + " Water | ";                   
        }                                     
    }         
      
};
};
//*********************************************************************
function getfoodlog (){
    console.log("food date check: " + fooddr);
//google.charts.load('current', {packages: ['corechart', 'bar']});
xhr_foodlog = new XMLHttpRequest();
xhr_foodlog.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/foods/log/date/'+ fooddr + '.json'); //2019-07-25.json');
xhr_foodlog.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_foodlog.send();
xhr_foodlog.onload = function() {
   if (xhr_foodlog.status === 200) {
      json = JSON.parse(xhr_foodlog.responseText);
       console.log("ReturnText: " + xhr_foodlog.responseText);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();

       data.addColumn('string', 'Macro');
       data.addColumn('number', 'Value');
       
       //Fill Data Table with Response Values   
            //data.setCell(i,0, new Date(json['activities-tracker-steps'][i].dateTime)); 
            data.addRows(1); 
            data.setCell(0,0, "Carbs");
            data.setCell(0,1, (json['summary'].carbs));
            data.addRows(1); 
            data.setCell(1,0,"Fat");
            data.setCell(1,1,(json['summary'].fat));
            data.addRows(1); 
           // data.setCell(2,0,"Fiber");
           // data.setCell(2,1,(json['summary'].fiber));
            data.addRows(1); 
            data.setCell(2,0,"Protein");
            data.setCell(2,1,(json['summary'].protein));
           // data.addRows(1); 
           // data.setCell(4,0,"Sodium");
           // data.setCell(4,1,(json['summary'].sodium));
            //data.addRows(1); 
            //data.setCell(5,0,"Water");
            //data.setCell(5,1,(json['summary'].water));


        
       //Console Notes 
        console.log("food date check: " + fooddr);
      console.log("data: " + data.length);
       console.log(JSON.stringify(data));
//       //Charting Options
       var options = { //google.charts.Line.convertOptions({
            title: 'Recorded Food',
            height: 350,
            width: 900,
            //viewWindow: {min: 0, max: 15000},
            //showTextEvery:1,scaleType: 'mirrorLog',
           vAxis: {"title":"Food"},
           hAxis:{"title":"Calories"} ,
           seriesType: 'bars',
            bars: 'vertical'
        };
        
        var poptions = { //google.charts.Line.convertOptions({
            title: 'Macros',
            pieHole: 2,
            height: 350,
            width: 900
            //viewWindow: {min: 0, max: 15000},
            //showTextEvery:1,scaleType: 'mirrorLog',
           //vAxis: {"title":"Food"},
           //hAxis:{"title":"Calories"} ,
        };
//        //    
        var chart = new google.visualization.PieChart(document.getElementById('foodsummary'));
        chart.draw(data, poptions);
       //Update Browser
       //-------------------------------------------------------------------------
        var i;
        var xdata = new google.visualization.DataTable();       
        xdata.addColumn('string', 'Food');
        xdata.addColumn('number', 'Calories');
        
        for (i=0; i <json['foods'].length; i++ ){
            xdata.addRows(1);       
            xdata.setCell(i,0, (json['foods'][i].loggedFood.name));
            xdata.setCell(i,1,(json['foods'][i].loggedFood.calories));
        }
        console.log("Look Here:  " + JSON.stringify(xdata));
        
        
        
        var xchart = new google.visualization.BarChart(document.getElementById('foodlog'));
        xchart.draw(xdata, options);
        
        
//        document.getElementById('foodlog').innerHTML = "";
//        for (i=0; i <json['foods'].length; i++ ){
//            document.getElementById('foodlog').innerHTML = document.getElementById('foodlog').innerHTML + '\n' + json['foods'][i].loggedFood.name + " " + json['foods'][i].loggedFood.calories;
//           
//        }    
        
    }         
      
};
};

//***********************************************************************
function getactivities(){
xhr_acts = new XMLHttpRequest();
xhr_acts.open('GET', 'https://api.fitbit.com/1/user/'+ userId +'/activities/recent.json');
xhr_acts.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_acts.send();
xhr_acts.onload = function() {
   if (xhr_acts.status === 200) {
       json = JSON.parse(xhr_acts.responseText);
       
        console.log("ActiveText: " + xhr_acts.responseText);
        console.log("Sample: " + json[1].activityId);
//       Setup Data Table with Columns       

      var data = new google.visualization.DataTable();
//       
       data.addColumn('string', 'Name');
       data.addColumn('string', 'Description');
       data.addColumn('number', 'Duration');
       data.addColumn('number', 'Calories');
//       
console.log("Length: " + json.length);       
//       //Fill Data Table with Response Values
       for (i=0; i <json.length; i++ ){
            data.addRows(1);       
            data.setCell(i,1,(json[i].name));
            data.setCell(i,1,(json[i].description));
            data.setCell(i,2,(json[i].duration));
            data.setCell(i,3,(json[i].calories));
            console.log("Description: " + json[i].name);                      
        }
//        
//        //Console Notes 
//       console.log("data: " + data.length);
//       console.log(JSON.stringify(data));
       //Charting Options
       var options = { 
            //title: 'Recent Activities',
            //height: 700,
            //width: 900,
            //seriesType: 'bars',
            //viewWindow: {min: 0, max: 15000},
            //showTextEvery:1,scaleType: 'mirrorLog',
            //vAxis: {"title":"Calories"},
            //hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        };
        
        var chart = new google.visualization.WordTree(document.getElementById('activitygraph'));
        chart.draw(data, options);
        
        
////       //Update Browser
////        var i;
////        document.getElementById('calories').innerHTML = "";
////        for (i=0; i <json['activities-heart'].length; i++ ){
////            document.getElementById('calories').innerHTML = document.getElementById('calories').innerHTML + '\n' + json['activities-heart'][i].dateTime + " - " + json['activities-heart'][i].value.restingHeartRate + " calories | ";                   
////        }
      }
};
};



//************************************************************************
function hideelement(z) {
  var x = document.getElementById(z);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};
//************************************************************************
function getdaterange(){
    var selection = document.getElementById("daterange");  

    var fdr = document.getElementById("fooddaterange").value;     
    fooddr = fdr.split("/", 3);
    fooddr = fooddr[2] + '-' + fooddr[0] + '-' + fooddr[1];
  
    daterange = selection.options[selection.selectedIndex].value;   
    
    console.log("food date " + fooddr);
    
    if (daterange === "1 month"){
        querydate = "1m";
    }
    if (daterange === "6 month"){
        querydate = "6m";
    }
    if (daterange === "3 month"){
        querydate = "3m";
    }   
        if (daterange === "1 day"){
        querydate = "1d";
    } 
    if (daterange === "1 week"){
        querydate = "1w";
    } 
    if (daterange === "1 year"){
        querydate = "1y";
    }           
};

function getsleep(){
xhr_sleep = new XMLHttpRequest();
xhr_sleep.open('GET', 'https://api.fitbit.com/1.2/user/'+ userId +'/sleep/date/2019-07-01/2019-08-02.json'); //' + querydate + '.json'); //
xhr_sleep.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr_sleep.send();
xhr_sleep.onload = function() {
   if (xhr_sleep.status === 200) {
       json = JSON.parse(xhr_sleep.responseText);
       console.log("ReturnText: " + xhr_sleep.responseText);
       console.log("Length: " + json['sleep'].length);
       //Setup Data Table with Columns        
       var data = new google.visualization.DataTable();
       data.addColumn('date', 'Date');
       data.addColumn('number', 'Sleep');
       //Fill Data Table with Response Values
       for (i=0; i <json['sleep'].length; i++ ){
            //console.log( i + " Catch: " + new Date(json['activities-tracker-steps'][i].dateTime) + " " + json['activities-tracker-steps'][i].value);
            var thedate = json['sleep'][i].dateOfSleep;
            console.log("thedate = " + thedate);
            dst = thedate.split("-");   dstmonth = new Number(dst[1]);    dstday = new Number(dst[2]);   dstyear= new Number(dst[0]);
            //console.log("Month " + dstmonth + " Day " + dstday + " Year " + dstyear);
            data.addRows(1);       
            //data.setCell(i,0, new Date(json['activities-tracker-steps'][i].dateTime)); 
            data.setCell(i,0, new Date(dstyear, dstmonth-1, dstday));
            data.setCell(i,1,(json['sleep'][i].minutesAsleep));
        }
       //Console Notes 
       console.log("data: " + data.length);
       console.log(JSON.stringify(data));
       //Charting Options
       var options = google.charts.Line.convertOptions({
            title: 'Sleep by Date',
            height: 350,
            width: 900,
            viewWindow: {min: 0, max: 15000},
            showTextEvery:1,scaleType: 'mirrorLog',
            vAxis: {"title":"Sleep"},
            hAxis:{"title":"Dates",format: 'MM/d/yy'}                    
        });
        //    
        //var chart = new google.charts.Line(document.getElementById('stepsgraph'));
        var chart = new google.visualization.LineChart(document.getElementById('sleepgraph'));
        chart.draw(data, options);
       //Update Browser
        var i;
        document.getElementById('sleep').innerHTML = "";
        for (i=0; i <json['sleep'].length; i++ ){
            document.getElementById('sleep').innerHTML = document.getElementById('sleep').innerHTML + '\n' + json['sleep'][i].dateOfSleep + " - " + json['sleep'][i].minutesAsleep + " sleep | ";                   
        }                                     
    }                
};
};


function gettoken() {
    xhr_gettoken = new XMLHttpRequest();
    xhr_gettoken.open('POST', 'https://api.fitbit.com/1.1/oauth2/introspect'); 
    xhr_gettoken.setRequestHeader("Authorization", 'Bearer ' + access_token);  
    xhr_gettoken.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//'Basic MjJEOEZWOjA5YmU4OTFlMWU3ZWQ1OGJjNTQ1ZTMzYTc3OTJmZGI0'); //, "Content-type", "application/x-www-form-urlencoded");
    xhr_gettoken.send("token=" + String(access_token));

    xhr_gettoken.onload = function() {    
        if (xhr_gettoken.status === 200) {
            json = JSON.parse(xhr_gettoken.responseText);
            console.log(json.active);
        }   

    };
};


function revoketoken() {
    xhr_gettoken = new XMLHttpRequest();
    xhr_gettoken.open('POST', 'https://api.fitbit.com/oauth2/revoke'); // + userId +'/sleep/date/2019-07-01/2019-07-22.json'); //' + querydate + '.json'); //
    xhr_gettoken.setRequestHeader("Authorization", 'Bearer ' + access_token);
   // xhr_gettoken.setRequestHeader("Authorization", 'Basic MjJEOEZWOjA5YmU4OTFlMWU3ZWQ1OGJjNTQ1ZTMzYTc3OTJmZGI0'); //, 
    xhr_gettoken.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//'Basic MjJEOEZWOjA5YmU4OTFlMWU3ZWQ1OGJjNTQ1ZTMzYTc3OTJmZGI0'); //, "Content-type", "application/x-www-form-urlencoded");
    xhr_gettoken.send("token=" + String(access_token));
    //xhr_gettoken.send("client_id= 22D8FV & token=" + String(access_token));

    xhr_gettoken.onload = function() {    
        if (xhr_gettoken.status === 200) {
            document.location.href = "index.html";
            //json = JSON.parse(xhr_gettoken.responseText);
            console.log("Revoked");
        }   

    };
};





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
//access_token = url.split("#")[1].split("=")[1].split("&")[0];
// get the userid
//userId = url.split("#")[1].split("=")[2].split("&")[0];
//console.log("token: " + access_token);
console.log("url: " + url);
getuser();      

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
var pins = [];
PDK.request('/boards/<board_id>/pins/', function (response) { // Make sure to change the board_id
  if (!response || response.error) {
    alert('Error occurred');
  } 
  else {
    pins = pins.concat(response.data);
    if (response.hasNext) {
      response.next(); // this will recursively go to this same callback
    }
  }
}
};
      
//xhr_user = new XMLHttpRequest();
//xhr_user.open('GET', 'GET /v1/me/boards/');
//xhr_user.setRequestHeader("Authorization", 'Bearer ' + access_token);
//xhr_user.send();
//xhr_user.onload = function() {   
   // document.getElementById('user').innerHTML = xhr_user.status;
  // if (xhr_user.status === 200) {
    //    userdata = JSON.parse(xhr_user.responseText);
      //  console.log("User: " + userdata);
        // document.getElementById('user').innerHTML = "User: " + userdata;
        
     // }
//};
//};      

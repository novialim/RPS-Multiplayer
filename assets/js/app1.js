$(document).ready(function() {

//Global Variables
var p1con;
var p2con;

var p1Choice = "";
var p2Choice = "";

var whichPlayer = "";

var p1win=0;
var p1loss=0;
var p2win=0;
var p2loss=0;

var currentWinner = "";

var gamestart = false;
var otherPlayertxt = "";


// Initialize Game
reset();

// Initialize Firebase
var config = {
  apiKey: "AIzaSyASl98xZRGcnShG7gIRuKs_VY8YqCs4b4Y",
  authDomain: "global-pagoda-167906.firebaseapp.com",
  databaseURL: "https://global-pagoda-167906.firebaseio.com",
  projectId: "global-pagoda-167906",
  storageBucket: "global-pagoda-167906.appspot.com",
  messagingSenderId: "198030424180"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
var playersRef = database.ref('players');

// ----------------------------------------------------------------
// Intro Screen & Transition Effect
// ----------------------------------------------------------------

    var getName = $('.form-group');

    $(getName).hide();
    $(getName).slideToggle(1500,"swing");

    var urlBoxT = $('#urlBox');
    $(urlBoxT).hide();
    $("#chat").hide();


// ----------------------------------------------------------------
// Handle game full on window load
// ----------------------------------------------------------------


    $(window).load(function() {
       database.ref().once('value', function(snapshot){

      if (snapshot.child("players/1").exists() && snapshot.child("players/2").exists()){
            $("#gameStatus").html("Game is full. Kick back, relax and enjoy ongoing game. <br/> Refresh your window to join in the fun when game slot becomes available");

        $(getName).hide();

        $('#player1').css('visibility', 'hidden');
        $('#player2').css('visibility', 'hidden');
        $("#p1Name").html("&nbsp;");
        $("#p2Name").html("&nbsp;");

        $("#p1WinsLosses").css('visibility', 'hidden');
        $("#p2WinsLosses").css('visibility', 'hidden');


        $("#p1scissors").unbind('click').attr('disabled', 'disabled');
        $("#p1rock").unbind('click').attr('disabled', 'disabled');
        $("#p1paper").unbind('click').attr('disabled', 'disabled');

        $("#p2scissors").unbind('click').attr('disabled', 'disabled');
        $("#p2rock").unbind('click').attr('disabled', 'disabled');
        $("#p2paper").unbind('click').attr('disabled', 'disabled');

       }
      });

    });


// ----------------------------------------------------------------
// Get/Check Player Names Elements / Connections / Inputs
// ----------------------------------------------------------------
    var username;

    $("#addUser").on("click", function(event) {
      event.preventDefault();
    // This line grabs the input from the textbox
        username = $("#name-input").val().trim();

        if(username!=""){

          database.ref().once('value', function(snapshot){

            if (snapshot.child("players/1").exists() && snapshot.child("players/2").exists()){
                  $('#p1p2').text("Game is full, refresh and join in a few minutes.");

             }


             if(!snapshot.child("players/1").exists() &&
              !snapshot.child("players/2").exists()){
                p1con = playersRef.child(1).push();

                playersRef.child(1).set({
                  name: username,
                  wins: 0,
                  losses: 0
                });

                var disconnect1 = firebase.database().ref("players/1");
                disconnect1.onDisconnect().set(null);

                $('#welcomeusername').text(username);
                $('#p1p2').text("You are Player 1");
                whichPlayer = 1;

                $(getName).slideToggle(1000,"swing");
                $(urlBoxT).show();

                $('#player1').css('visibility', 'visible');
                $('#player2').css('visibility', 'hidden');

                // p1win=0;
                // p1loss=0;
                // p2win=0;
                // p2loss=0;
                
             }
             else if (!snapshot.child("players/1").exists() && snapshot.child("players/2").exists()){
                
                p1con = playersRef.child(1).push();
                playersRef.child(1).set({
                  name: username,
                  wins: 0,
                  losses: 0
                });  

                $('#welcomeusername').text(username);
                $('#p1p2').text("You are Player 1");
                whichPlayer = 1;

                $(getName).slideToggle(1000,"swing");
                $('#player1').css('visibility', 'visible');
                $('#player2').css('visibility', 'hidden');
                
                var disconnect1 = firebase.database().ref("players/1");
                disconnect1.onDisconnect().set(null);

             }
             else if (snapshot.child("players/1").exists() && !snapshot.child("players/2").exists()){
                
                p2con = playersRef.child(2).push();
                playersRef.child(2).set({
                  name: username,
                  wins: 0,
                  losses: 0
                });  

                $('#welcomeusername').text(username);
                $('#p1p2').text("You are Player 2");
                whichPlayer = 2;

                $(getName).slideToggle(1000,"swing");
                // $(urlBoxT).slideDown(1000);
                $('#player2').css('visibility', 'visible');
                $('#player1').css('visibility', 'hidden');
                

                var disconnect2 = firebase.database().ref("players/2");
                disconnect2.onDisconnect().set(null);


             }

          });

        } // End of if username != null

    }); //End of adduser click


// Firebase watcher + initial loader HINT: .on("value")
    database.ref('/players').on("value", function(childSnapshot) {

      if(childSnapshot.val()!= null){
       // storing the snapshot.val() in a variable for convenience
      
        var sv = childSnapshot.val();
        var allPlayers = [];
        
        // Getting an array of each key In the snapshot object
        var svArr = Object.keys(sv);

        if(svArr.length>1){
        // Finding the last user's key
          var lastIndex = svArr.length - 1;
          var p2Key = svArr[lastIndex];
          var secondPlayer = sv[p2Key];
          
          $('#p2Name').text(secondPlayer.name);
        }
        var p1Key = svArr[0];

        // Using the player's key to access the player object
        var firstPlayer = sv[p1Key];
         
        $('#p1Name').text(firstPlayer.name);

        // Put all player objects from database into array
        for(var i in sv) {

          // Print the initial data to the console.
          // console.log("player" +i+ ":" +sv[i]);

          allPlayers.push([i,sv[i]]);
        }

          $("#p1Name").html("&nbsp;");
          $("#p2Name").html("&nbsp;");


            //Update player with player data
            allPlayers.forEach(function(playerData){

              if(playerData[0]==="1"){
                // console.log("player 1 exists");

                $('#p1Name').text("Player 1: "+playerData[1].name).css('visibility', 'visible');
                $("#p1WinsLosses").text("Wins: "+playerData[1].wins+" Losses: "+playerData[1].losses);                  

              }
              
              if(playerData[0]==="2"){
                // console.log("player 2 exists");

                $('#p2Name').text("Player 2: "+playerData[1].name).css('visibility', 'visible');
                $("#p2WinsLosses").text("Wins: "+playerData[1].wins+" Losses: "+playerData[1].losses);  
              }

              // console.log("there are how many players now? " +allPlayers.length);


          });




          if(childSnapshot.child(1).child("choice").val()!==null){

            p1Choice = childSnapshot.child(1).child("choice").val();
            // $("#gameStatus").text("Waiting for "+snap.child(2).child("name").val()+" to chose.");
            // otherPlayertxt = "Waiting for "+childSnapshot.child(2).child("name").val()+" to chose.";
            // console.log("Player 1 has chosen, now waiting for player 2: " + otherPlayertxt);

          }

          if(childSnapshot.child(2).child("choice").val()!==null){
            // console.log("Player 2 picked something!"+snap.child(2).child("choice").val());

            p2Choice = childSnapshot.child(2).child("choice").val();   
            // $("#gameStatus").text("Waiting for "+snap.child(1).child("name").val()+" to chose."); 
            // otherPlayertxt = "Waiting for "+childSnapshot.child(1).child("name").val()+" to chose.";
            // console.log("Player 2 has chosen, now waiting for player 1: " + otherPlayertxt);

          }


        // ----------------------------------
        // Who's the winner?
        // ----------------------------------
          if(childSnapshot.child(1).child("choice").exists() && childSnapshot.child(2).child("choice").exists() && p1Choice!=="" && p2Choice!==""){

            // otherPlayertxt="";

              if (p1Choice === p2Choice) {
                  
                  currentWinner="";
                  updateGameResult();

                  $("#gameStatus").text("It's a tie!");
                   $(this).delay(5000).queue(function() {
                  resetGameRound();

                   $(this).dequeue();

                });
              } 
              else if (
              ((p1Choice === "rock") && (p2Choice === "scissors")) || 
              ((p1Choice === "paper") && (p2Choice === "rock")) ||
              ((p1Choice === "scissors") && (p2Choice === "paper"))
              ) 
              {     
                  currentWinner="player1";
                  console.log("Winner is Player 1!!");
                  updateGameResult();

                $(this).delay(5000).queue(function() {
                  resetGameRound();

                  $(this).dequeue();

                });

              } else 
              {

                currentWinner="player2";
                console.log("Winner is Player 2!!");
                updateGameResult();

                $(this).delay(5000).queue(function() {
                  resetGameRound();

                  $(this).dequeue();

                });

              }

          }


        



      } // End of if childsnapshot != null
    });
            
//----------------------------------
// Choice Listener / RSP Comparison
//----------------------------------


function updateGameResult(){

  otherPlayertxt="";

  console.log("in udpategamesresult P1choice is: "+p1Choice);
  console.log("in udpategamesresult P2choice is: "+p2Choice);

  if (p1Choice==="rock"){
    $('#p1rock').css('visibility', 'visible');
  }
  else if(p1Choice==="paper"){
    $('#p1paper').css('visibility', 'visible');
  }
  else if(p1Choice==="scissors"){
    $('#p1scissors').css('visibility', 'visible');
  }
  
  if (p2Choice==="rock"){
    $('#p2rock').css('visibility', 'visible');
  }
  else if(p2Choice==="paper"){
    $('#p2paper').css('visibility', 'visible');
  }
  else if(p2Choice==="scissors"){
    $('#p2scissors').css('visibility', 'visible');
  }

    database.ref("/players").child(1).update({
      choice:""
    });

    database.ref("/players").child(2).update({
      choice:""
    });

  if(currentWinner==="player1"){
    p1win++;
    p2loss++;    
    $("#gameStatus").text("Player 1 wins!");
  }

  else if (currentWinner==="player2"){
    p2win++;
    p1loss++;
    $("#gameStatus").text("Player 2 wins!");
  }

  $("#p1WinsLosses").css('visibility', 'visible');
  $("#p2WinsLosses").css('visibility', 'visible');


    database.ref("/players").child(1).update({
          losses:p1loss,
          wins:p1win
        });

      database.ref("/players").child(2).update({
        losses:p2loss,
        wins:p2win
      });

}

function resetGameRound(){

  console.log("player 3 is whichPlayer?"+whichPlayer);
         
    $("#p"+whichPlayer+"scissors").hide();
    $("#p"+whichPlayer+"rock").hide();
    $("#p"+whichPlayer+"paper").hide();  

    if(whichPlayer===1){
      $("#p2scissors").css('visibility', 'hidden');
      $("#p2rock").css('visibility', 'hidden');
      $("#p2paper").css('visibility', 'hidden');
    }
    else if(whichPlayer===2){
      $("#p1scissors").css('visibility', 'hidden');
      $("#p1rock").css('visibility', 'hidden');
      $("#p1paper").css('visibility', 'hidden');
    }
    else{
      $("#p1scissors").css('visibility', 'hidden');
      $("#p1rock").css('visibility', 'hidden');
      $("#p1paper").css('visibility', 'hidden'); 
      $("#p2scissors").css('visibility', 'hidden');
      $("#p2rock").css('visibility', 'hidden');
      $("#p2paper").css('visibility', 'hidden'); 
       
    }

      $("#p"+whichPlayer+"scissors").show();
      $("#p"+whichPlayer+"rock").show();
      $("#p"+whichPlayer+"paper").show();  

      $("#gameStatus").html("&nbsp;");



}


// Check for number of players 
var connectionsRef = database.ref("/players");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  if(snap.numChildren()==2){
    $("#status-bar").text("Let's Play!");
    $("#status-bar").css({"background":"green"});

    $("#prompt").hide();
    $("#urlBox").hide();

    gamestart = true;

  }

  if(snap.numChildren()==1)
  {
    $("#prompt").hide();
    $("#urlBox").show();
    $("#chat").show();    

    gamestart = false;
  } 
  if(snap.numChildren()<2)
  {
    $("#status-bar").text("Awaiting Opponent");
    $("#status-bar").css({"background":"#FE1A00"});

    $("#p1WinsLosses").css('visibility', 'hidden');
    $("#p2WinsLosses").css('visibility', 'hidden');

    gamestart = false;

    p1win=0;
    p1loss=0;
    p2win=0;
    p2loss=0;
  }

  if(snap.numChildren()==0){
    $("#prompt").show();
    reset();
  } 




});


// ----------------------------
// Game play
// ----------------------------

$("#p1rock").on("click", function(event){
  
  $("#p1scissors").hide();
  $("#p1paper").hide();  

    database.ref("/players").child(1).update({
      choice:"rock"
    });
});
$("#p1scissors").on("click", function(event){
  
  $("#p1rock").hide();
  $("#p1paper").hide();

  database.ref("/players").child(1).update({
      choice:"scissors"
    });
});
$("#p1paper").on("click", function(event){
  
  $("#p1scissors").hide();
  $("#p1rock").hide();

  database.ref("/players").child(1).update({
      choice:"paper"
    });
});


$("#p2rock").on("click", function(event){
  
  $("#p2scissors").hide();
  $("#p2paper").hide();  

  database.ref("/players").child(2).update({
      choice:"rock"
    });
});
$("#p2scissors").on("click", function(event){
  
  $("#p2rock").hide();
  $("#p2paper").hide();

  database.ref("/players").child(2).update({
      choice:"scissors"
    });
});
$("#p2paper").on("click", function(event){
  
  $("#p2scissors").hide();
  $("#p2rock").hide();

  database.ref("/players").child(2).update({
      choice:"paper"
    });
});



// ----------------------------
// Chat feature
// ----------------------------



// $("#newMessage input").on("keyup",function(){
//     var msg = $("#newMessage input").val();

//     console.log(msg);

//   });

$("#newMessage input").keypress(function(e) {
  
  if(e.keyCode == 13){
    
    var message = $("#newMessage input").val();
    console.log(message);    
    $("#newMessage input").val("");

    database.ref('chat').push({
      name:username,
      message:message

    });




  // Firebase watcher + initial loader HINT: .on("value")
  database.ref('/chat').on("value", function(childSnapshot) {

    if(childSnapshot.val()!= null){
       // storing the snapshot.val() in a variable for convenience
      
        var sv = childSnapshot.val();
        var allMessages = [];
        
        // Getting an array of each key In the snapshot object
        var svArr = Object.keys(sv);

        // Put all message objects from database into array
        for(var i in sv) {

          // Print the initial data to the console.
          // console.log("player" +i+ ":" +sv[i]);
          console.log("message objects: "+sv[i]);

          allMessages.push([i,sv[i]]);
        }

         // $("#listMessages").append(allMessages[1].name+" : "+allMessages[1].message);
    }
  });  


        // ----------------------------------
        // Who's the winner?
        // ----------------------------------
          if(childSnapshot.child(1).child("choice").exists() && childSnapshot.child(2).child("choice").exists() && p1Choice!=="" && p2Choice!==""){

            // otherPlayertxt="";

              if (p1Choice === p2Choice) {
                  
                  currentWinner="";
                  updateGameResult();

                  $("#gameStatus").text("It's a tie!");
                   $(this).delay(5000).queue(function() {
                  resetGameRound();

                   $(this).dequeue();

                });
              } 
              else if (
              ((p1Choice === "rock") && (p2Choice === "scissors")) || 
              ((p1Choice === "paper") && (p2Choice === "rock")) ||
              ((p1Choice === "scissors") && (p2Choice === "paper"))
              ) 
              {     
                  currentWinner="player1";
                  console.log("Winner is Player 1!!");
                  updateGameResult();

                $(this).delay(5000).queue(function() {
                  resetGameRound();

                  $(this).dequeue();

                });

              } else 
              {

                currentWinner="player2";
                console.log("Winner is Player 2!!");
                updateGameResult();

                $(this).delay(5000).queue(function() {
                  resetGameRound();

                  $(this).dequeue();

                });

              }

          }

      } // End of if childsnapshot != null



  });

  } // End of keycode control

});





}); //End of document load


function reset(){
  $('#player1').css('visibility', 'hidden');
  $('#player2').css('visibility', 'hidden');
  $("#p1Name").html("&nbsp;");
  $("#p2Name").html("&nbsp;");

  $("#p1WinsLosses").css('visibility', 'hidden');
  $("#p2WinsLosses").css('visibility', 'hidden');

  gamestart = false;
  console.log("The current URL is: "+window.location.href);
  $(".url").val(window.location.href);
  currentWinner="";

  p1win=0;
  p1loss=0;
  p2win=0;
  p2loss=0;
}

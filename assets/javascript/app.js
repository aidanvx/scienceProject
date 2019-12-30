// Initialize Firebase
var config = {
    apiKey: "AIzaSyCcSBS6ysfWBG2K77eaqkzrrB60nlS4b9s",
    // authDomain: "trainscheduler-dd560.firebaseapp.com",
    databaseURL: "https://aidansscienceproject.firebaseio.com/"
    // storageBucket: "trainscheduler-dd560.appspot.com"
};



firebase.initializeApp(config);
var database = firebase.database();

//event handlers
$('#startButton').click(function () {
    startGame();
});

$('#circleField').on('click', '.circle', function () {
    circleClicked($(this).attr('id'));
});

$('#trialCompleteDisplay').click(function () {
    startTrial();
});


//global variables
var userName = "";
var colorForSubject;
var score=0;
var trial1score = 0;
var trial2score = 0;
var trial3score = 0;
var highScore=0;
var trial=0;
var trialFinished = false;
var gameFinished = false; //for when all three trials are done
var circleLocations = []
//for the time interval
var intervalNeedsClearing = false;

function startGame() {
    // alert("time to start game.");
    userName = prompt("What is your name?");
    document.getElementById('openingSplash').style.display = "none";
    assignColorToTestSubject();
    document.getElementById('runningGameBox').style.display = "inline-block";
    startTrial();;
}

function startTrial() {
    trial++;
    score = 0;
    // trialFinished=false;
    $('#scoreDisplay').html("<p>Score: " + score + "</p>");
    document.getElementById('responseSplash').style.display = "none";
    //destroy any and all old circles in the runningGameBox
    destroyCircles();
    document.getElementById('runningGameBox').style.display = "inline-block";
    var newLocation = findNewLocation(); 
    displayCircle(newLocation);
    startTimer();
}

//this function starts a countdown and updates the view every second to show the time remaining
function startTimer() {
    //set initial time
    var t = 15;
    //put time up on board
    $('#timerClock').html("<p>Time remaining: " + t + "s</p>");
    //now use a set interval function to fire code every 1000 ms
    var timer = setInterval(function () {
        //1000ms will elapse before the contents of this function will fire
        //decrement the timer
        t--;
        $('#timerClock').html("<p>Time remaining: " + t + "s</p>");
        //first check and see if time is remaining. if so, check and see if user
        //clicked a choice, which would have set the intNeedsClearing bool to true
        if (t > 0) {
            if (intervalNeedsClearing === true) {
                clearInterval(timer);
                //here, we clear out the countdown clock display, that way, it won't show the wrong thing later
                $('#timerClock').html("<p></p>");
                intervalNeedsClearing = false;
            }
        }
        //now handle business of timer running out
        else if (t === 0) {
            clearInterval(timer);
            //here, we clear out the countdown clock display, that way, it won't show the wrong thing later
            $('#timerClock').html("<p></p>");
            userClickedWrong();
        }
    }, 1000);
}


function circleClicked(indexOfCircle) {
    //first, clear out the countdown clock display, that way, it wont show the wrong thing later
    $('#timerClock').html("<p></p>");
    //second figure out what the user clicked
    var circleNumber = indexOfCircle.replace('circle', '');
    // alert(circleNumber);
    //third, figure out correct answer
    if(circleNumber == score+1){
        intervalNeedsClearing = true;
        userClickedCorrect();
    }
    else{
        intervalNeedsClearing = true;
        userClickedWrong();
    }
}

function userClickedCorrect(){
    // alert("You are correct!!!!");
    score=score+1;
    $('#scoreDisplay').html("<p>Score: " + score + "</p>");
    fadeOutAndFadeInNewCircle();
}

function fadeOutAndFadeInNewCircle() {
    var newLocation = findNewLocation();
    // document.getElementById('runningGameBox').style.display = "none";
    $('#runningGameBox').fadeOut(500);
    setTimeout(function(){
        displayCircle(newLocation);
        // document.getElementById('runningGameBox').style.display = "inline-block";
        $('#runningGameBox').fadeIn(500);
        startTimer();
    },2000)
}

function userClickedWrong(){
    // alert("You are wrong!!!!");
    if (score > highScore) {
        highScore = score;
    }
    // trialFinished = true;
    displayFinalTrialScore();
}

function findNewLocation(){
    var goodPointFound = false;
    var loopCycle = 0;
    while (goodPointFound == false){
        loopCycle++;
        //create a random point
        var proposedPoint = createRandomPoint();
        //check that is doesnt conflict
        var doesConflict = doesPointConflict(proposedPoint);
        if (doesConflict == false){
            goodPointFound = true;
            //push the new point onto the array with created points
            circleLocations.push(proposedPoint);
            return proposedPoint;
        }
        if (loopCycle > 10000) {
            goodPointFound = true;
            return proposedPoint;
            alert("The game is having a problem finding a spot for a new point. You win.");
            //end the trial at this point and record the score
            userClickedWrong();
        }
    }
}

function createRandomPoint () {
    newX = Math.floor((Math.random() * 580));
    newY = Math.floor((Math.random() * 380));
    newPoint = [newX, newY];
    return newPoint;
}

function doesPointConflict(proposedPoint) {
    //need to check if point conflicts with any others in the array circleLocations and return a bool
    for (var i=0; i<circleLocations.length; i++) {
        var conflictFound = doPointsConflict(proposedPoint, circleLocations[i]);
        if (conflictFound == true) {
            return true;
        }
    }
    return false;
}

function doPointsConflict(proposedPoint, existingPoint) {
    if (
        (proposedPoint[0] >= existingPoint[0]-20 && proposedPoint[0] <= existingPoint[0]+20) &&
        (proposedPoint[1] >= existingPoint[1]-20 && proposedPoint[1] <= existingPoint[1]+20)
    ) {
        // alert ("a conflict was found between the proposed point " + proposedPoint[0] + ", " + proposedPoint[1] + " and existing point " + existingPoint[0] + ", " + existingPoint[1]);
        return true;
    }
    else return false;
}

function displayCircle(newLocation){
    // alert ("display circle method called with point: " + newLocation[0] + ", " + newLocation[1]);
    var circle = document.createElement("DIV");   // Create a <div> element
    circle.setAttribute("class", "circle");
    var circleNumber = score+1;
    circle.setAttribute("id", "circle" + circleNumber); 
    var x=newLocation[0];
    var y=newLocation[1];
    var xcord = "left: " + x + "px";
    var ycord = "top: " + y + "px";
    circle.setAttribute("style", xcord + ";" + ycord);                
    document.getElementById("circleField").appendChild(circle);
}

function destroyCircles() {
    // document.getElementById("circleField").;
    const myNode = document.getElementById("circleField");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}


//this function handles the end of game logic and displays the final score
function displayFinalTrialScore() {
    document.getElementById('runningGameBox').style.display = "none";
    document.getElementById('trialCompleteDisplay').style.display = "none";
    document.getElementById('allTrialsCompleteDisplay').style.display = "none";
    document.getElementById('responseSplash').style.display = "inline-block";
    if (trial<3) {
        if (trial == 1) {trial1score = score}
        else if (trial == 2) {trial2score = score}
        var displayText = "Trial complete. You got a score of " + score + ". Click here to start your next trial.";
        $('#trialCompleteDisplay').html("<p>" + displayText + "</p>");
        document.getElementById('trialCompleteDisplay').style.display = "inline-block";
    }
    else {
        trial3score = score;
        var displayText = "Trial complete. You got a score of " + score + ". Your high score of all three trials was " + highScore + ". Thank you for playing.";
        $('#allTrialsCompleteDisplay').html("<p>" + displayText + "</p>");
        document.getElementById('allTrialsCompleteDisplay').style.display = "inline-block";
        addFirebaseRecord();
    }
    trialFinished = false;
    score = 0
}

function assignColorToTestSubject() {
    //first pick a random number from 1 to 3
    var randomNumber = Math.floor((Math.random() * 3) + 1);
    // alert("the number is " + randomNumber);
    //next, assign a color based on the number
    if (randomNumber == 1) {colorForSubject = "white"}
    else if (randomNumber == 2) {colorForSubject = "red"}
    else {colorForSubject = "blue"}
    // alert("the color will be " + colorForSubject);
    //finally, set the game stage style accordingly
    document.getElementById('gameBox').style.backgroundColor = colorForSubject;
}

function addFirebaseRecord() {
    // Creates local "temporary" object for holding record data
    var newTestResult = {
        name: userName,
        colorAssignment: colorForSubject,
        testScore1: trial1score,
        testScore2: trial2score,
        testScore3: trial3score,
        testHighScore: highScore
    };
    // Uploads route data to the database
    database.ref().push(newTestResult);
}
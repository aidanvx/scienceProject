//ititialize firebase
var config = {
    apiKey: "AIzaSyArQhWESFPU62JvjBiNe1Ft_iFsfiIZIaA",
    databaseURL: "https://aidansscienceproject.firebaseio.com"
};

firebase.initializeApp(config);
var database = firebase.database()

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
var userName="";
var colorThatThePlayerSeesAndIndependantVariableInTest;
var score=0; //current score
var trial1Score=0;
var trial2Score=0;
var trial3Score=0;
var highScore=0;
var currentTrial=0;
var trialFinished = false;
var gameFinished = false; //for when all three trials are done
var circleLocations = [];
var intervalNeedsClearing = false;

function startGame() {
    // alert("time to start game.");
    userName=prompt("Please write your username here.");
    assignColorToTestSubject();
    document.getElementById('openingSplash').style.display = "none";
    document.getElementById('runningGameBox').style.display = "inline-block";
    startTrial();;
}

function assignColorToTestSubject(){
    //pick random number between 1 and 3
    var randomNumber = Math.floor(Math.random()*3) + 1;  
    //alert("the random number is " + randomNumber);     
    //pick a color based on that number
    if(randomNumber == 1) {
        colorThatThePlayerSeesAndIndependantVariableInTest = "white";
    }
    else if(randomNumber == 2){
        colorThatThePlayerSeesAndIndependantVariableInTest="blue";
    }
    else {
        colorThatThePlayerSeesAndIndependantVariableInTest="red";
    }
    //then change background to that color
    document.getElementById('gameBox').style.backgroundColor=colorThatThePlayerSeesAndIndependantVariableInTest;
    //I like pizza
}

function startTrial() {
    {
        currentTrial++;
        score = 0;
        $('#scoreDisplay').html("<p>Score: " + score + "</p>");
        document.getElementById('responseSplash').style.display = "none";
        allCirclesShallDie();
        document.getElementById('runningGameBox').style.display = "inline-block";
        var newLocation = findNewLocation(); 
        // alert("We are now goint to create a point at " + newLocation[0] + ", " + newLocation[1]);
        displayCircle(newLocation);
        startTimer();
    }
}

function allCirclesShallDie(){
    const myNode = document.getElementById("circleField");
    while(myNode.firstChild){
        myNode.removeChild(myNode.firstChild);
    }
} 

function findNewLocation(){
    var goodPointFound = false;
    var loopCycle = 0;
    while(goodPointFound == false) {
        loopCycle++;
        // alert("need to create a random point");
        var proposedPoint = createRandomPoint();
        // alert("just created a random point");
        // alert("we are now abou to check to see if point " + proposedPoint[0] + ", " + proposedPoint[1] + " is going to overlap anything.");
        var doesConflict = doesConflictWithAnyPoints(proposedPoint);
        // alert("We checked the point");
        if(doesConflict == false){
            goodPointFound = true;
            circleLocations.push(proposedPoint);
            return proposedPoint;
        }
        if(loopCycle>10000){
            goodPointFound= true;
            alert("the game is having a problem finding a spot for a new point. You win.");
            userClickedWrong();
            return proposedPoint;
        }
    }
}

function createRandomPoint(){
    //x value must be between 1 and 580
    //y value must be between 1 and 380
    var X = Math.floor( (Math.random() * 580) + 1);
    var Y = Math.floor( (Math.random() * 380) + 1);
    // alert("need to return a random point");
    return [X,Y];
}

function doesConflictWithAnyPoints(proposedPoint){
    // alert("we are now checking to see if point " + proposedPoint[0] + ", " + proposedPoint[1] + " is going to overlap anything.");
    //takes proposed point as an input
    //checks all the existing points in circleLocations global variable
    //returns true if it overlaps, returns false if it doesn't
    for(var i = 0; i<circleLocations.length; i++) {
        var conflictfound = checkTwoPoints(proposedPoint, circleLocations[i]);
        if(conflictfound == true){
            return true
        }
    }
    return false;
}


function checkTwoPoints(proposedPoint, existingPoint){
    //two point come in to this funtion
    //we see if they are on top of each other
    //if they are, we return true, if they are not we return false
    if(
        proposedPoint[0] >= existingPoint[0]-20 && proposedPoint[0] <= existingPoint[0]+20 &&
        proposedPoint[1] >= existingPoint[1]-20 && proposedPoint[1] <= existingPoint[1]+20
    )
    {
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


//this function starts a countdown and updates the view every second show the time remaining
function startTimer() {
    // alert("timer started");
    var t = 15;
    $('#timerClock').html("<p>Time remaining: " + t + "s</p>");
    var timer = setInterval(function () {
        //now decrement the timer
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
    $('#runningGameBox').fadeOut(500);
    setTimeout(function(){
        displayCircle(newLocation);
        $('#runningGameBox').fadeIn(500);
        startTimer();
    },2000)
    
}

function userClickedWrong(){
    // alert("You are wrong!!!!");
    if(score>highScore){
        highScore=score;
    }
    displayFinalTrialScore();
}


//this function handles the end of game logic and displays the final score
function displayFinalTrialScore() {
    // alert("trial over.");
    document.getElementById('runningGameBox').style.display = "none";
    document.getElementById('trialCompleteDisplay').style.display = "none";
    document.getElementById('allTrialsCompleteDisplay').style.display = "none";
    document.getElementById('responseSplash').style.display = "inline-block";
    if(currentTrial<3){
        if(currentTrial == 1){
            trial1Score = score;
        }
        else if(currentTrial == 2){
            trial2Score = score;
        }
        var displayText = "Trial complete. You got a score of " + score + ". Click here to start your next trial.";
        // alert("trial complete. should now print" + displayText);
        $('#trialCompleteDisplay').html("<p>" + displayText + "</p>");
        document.getElementById('trialCompleteDisplay').style.display = "inline-block";
    }
    else {
        trial3Score = score;
        var displayText = "Trial complete. You got a score of " + score + ". Your high score of all three trials is " + highScore + ". Thank you for playing, " + userName + ".";
        $('#allTrialsCompleteDisplay').html("<p>" + displayText + "</p>");
        document.getElementById('allTrialsCompleteDisplay').style.display = "inline-block";
        writeOutToDatabase();
    }
    $('#trialCompleteDisplay').html("<p>" + displayText + "</p>");
    trialFinished = false;
    score = 0
}

function writeOutToDatabase(){
    var newTestResult = {
        userName: userName,
        color: colorThatThePlayerSeesAndIndependantVariableInTest,
        test1: trial1Score,
        test2: trial2Score,
        test3: trial3Score,
        testHighScore: highScore
    };
    database.ref().push(newTestResult);
}
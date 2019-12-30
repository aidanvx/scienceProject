//event handlers
$('#startButton').click(function () {
    startGame();
});

$('#trialCompleteDisplay').click(function () {
    startNewTrial();
});

//global variables
var score=0; //
var trialFinished = false;
var gameFinished = false; //for when all three trials are done
var testLocations=
[
    [20,20],
    [50,50],
    [100,100]
]
var intervalNeedsClearing = false;
var currentIndex = 0;

function startGame() {
    // alert("time to start game.");
    document.getElementById('openingSplash').style.display = "none";
    document.getElementById('runningGameBox').style.display = "inline-block";
    startTrial();;
}

$('#circleField').on('click', '.circle', function () {
    circleClicked($(this).attr('id'));
});

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
    alert("You are correct!!!!");
    score=score+1;
    $('#scoreDisplay').html("<p>Score: " + score + "</p>");
    var newLocation = findNewLocation(); 
    displayCircle(newLocation);
    startTimer();
    // document.getElementById('runningGameBox').style.display = "none";
    // document.getElementById('responseSplash').style.display = "inline-block";
    // var displayText = "That was correct!";
    // $('#dialogDisplay').html("<p>" + displayText + "</p>");
    // // console.log(displayText);
    // setTimeout(function () {
    //     document.getElementById('responseSplash').style.display = "none";
    //     document.getElementById('runningGameBox').style.display = "inline-block";
    //     currentIndex++;
    //     moveOn();
    // }, 2000);
}

function userClickedWrong(){
    alert("You are wrong!!!!");
    displayFinalTrialScore();
    // document.getElementById('runningGameBox').style.display = "none";
    // document.getElementById('responseSplash').style.display = "inline-block";
    // var displayText = "The correct answer was: " + questions[currentIndex][1];
    // $('#dialogDisplay').html("<p>" + displayText + "</p>");
    // // console.log(displayText);
    // setTimeout(function () {
    //     document.getElementById('responseSplash').style.display = "none";
    //     document.getElementById('runningGameBox').style.display = "inline-block";
    //     currentIndex++;
    //     moveOn();
    // }, 3000);
}

//this function gets called after the current index has been incremented and
//it is now time to display another question (if available) or show the final score
function moveOn() {
    alert("moveOn methof fired");

}

function startTrial() {
    // while (trialFinished==false)
    {
        $('#scoreDisplay').html("<p>Score: " + score + "</p>");
        var newLocation = findNewLocation(); 
        displayCircle(newLocation);
        startTimer();
    }
}


function findNewLocation(){
    var newCirclePosition = testLocations[score];
    return newCirclePosition;
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
    var t = 15;
    var timer = setInterval(function () {
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
        //now decrement the timer
        t--;
    }, 1000);
}







//this function handles the end of game logic and displays the final score
function displayFinalTrialScore() {
    // alert("Game over. You got " + hits + " questions right and " + misses + " questions wrong.");
    document.getElementById('runningGameBox').style.display = "none";
    document.getElementById('responseSplash').style.display = "inline-block";
    var displayText = "Trial complete. You got a score of " + score + ". Click here to start your next trial.";
    $('#trialCompleteDisplay').html("<p>" + displayText + "</p>");
    trialFinished = false;
    score = 0
}

function startNewTrial() {
    if (trialFinished) {
        trialFinished = false;
        currentIndex = 0;
        document.getElementById('responseSplash').style.display = "none";
        startGame();
    }
}
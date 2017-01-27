/*******************
/* GLOBAL VARIABLES
*******************/
var isPlaying = false;	// Prevent start button from being hit multiple times
var powerOn = false;
var incorrectPattern = false;
var strictReset = false;
var currentMoves = 0;
var maxMoves = 0;
var currentIteration = 0;
var currentSpeed;
var mode = "standard";
var computerPattern = [];
var userPattern = [];
var soundURLs = {
	green: "assets/sounds/green.mp3",
	red: "assets/sounds/red.mp3",
	yellow: "assets/sounds/yellow.mp3",
	blue: "assets/sounds/blue.mp3",
	wrong: "assets/sounds/wrong.mp3",
	win: "assets/sounds/game_over.mp3"
}

/******************
/* MAIN FUNCTIONS
******************/

// Creates sequence and then displays
function createBoard() {

	generateSequence();
	showBoard();
}

// Generates random piece and pushes to computerPattern array
function generateSequence() {

	var randomNumber = Math.floor(Math.random() * 4);
	buildArr(randomNumber, computerPattern, true);
}

// Displays computerPattern array
function showBoard() {
	
	maxMoves = computerPattern.length;
	currentSpeed = calculateSpeed(maxMoves);
	$(".screenText").removeClass("blink");
	$(".screenText").text(maxMoves);
	disableClick();

	// IIFE that loops through each element at currentSpeed interval
	var i = 0;

	(function loop() {
		var color = computerPattern[i];

		if (color === "green") {
			lightUpBoard(".green");
			playSound(color);
		} else if (color === "red") {
			lightUpBoard(".red");
			playSound(color);
		} else if (color === "yellow") {
			lightUpBoard(".yellow");
			playSound(color);
		} else {
			lightUpBoard(".blue");
			playSound(color);
		}

		if (++i < computerPattern.length) {
			setTimeout(loop, currentSpeed);
		}
	})();

	// Calculate time needed to show current pattern before
	// re-enabling click.  0.2s buffer added to total time.
	var timeToWait = (maxMoves * currentSpeed);
	setTimeout(enableClick, timeToWait);
}

// Pushes user moves to userPattern array and lights up part of board clicked
function logMoves(color) {
	currentMoves++;
	lightUpBoard("." + color);
	buildArr(color, userPattern, false);
}

// Checks each time user clicks piece to ensure it
// matches computer's pattern
function checkArr(color) {

	if (computerPattern[currentIteration] !== userPattern[currentIteration]) {
		incorrectPattern = true;
		$(".screenText").text("! ! !").addClass("blink");
	}

	if (mode === "strict" && incorrectPattern) {
		disableClick();
		playSound("wrong");
		softReset();
		setTimeout(createBoard, 2000);
		return;
	} else if (incorrectPattern) {
		disableClick();
		playSound("wrong");
		incorrectPattern = false;
		userPattern = []; // Erase current pattern
		currentMoves = 0;
		currentIteration = 0; // Set iterator back to beginning of both arrays
		setTimeout(showBoard, 2000); // Show correct pattern again

		// Calculate time needed to show current pattern again before
		// re-enabling click.  Adds time delay before board is shown 
		// (2000ms) and how long it will take to show entire board again 
		// based on the current speed.
		var timeToWait = (computerPattern.length * currentSpeed) + 2000;
		setTimeout(enableClick, timeToWait);
		return;
	} else if (currentMoves === 20) {  // Winner declared at 20 moves
		playSound("win");
		$(".screenText").text("WIN").addClass("blink");
		softReset();
		setTimeout(createBoard, 6000);
		return;
	}

	// If user click matches computer pattern, iterator is incremented
	currentIteration++;
	playSound(color);
}

/*******************
/* HELPER FUNCTIONS
*******************/

// Play sound based on color
function playSound(source) {
	var audio = document.getElementById("sound");
	audio.src = soundURLs[source];
	audio.play();
}

// "Light" selected pieces by changing opacity
function lightUpBoard(selector, color) {
	$(selector).css("opacity", "1.0");
	setTimeout(function() {
		$(selector).css("opacity", "0.7")
	}, 400);
}

// Speeds up display after certain # of moves
function calculateSpeed(numMoves) {
	if (numMoves < 5) {
		return 1000;
	} else if (numMoves < 9) {
		return 700;
	} else if (numMoves < 13) {
		return 600;
	} else {
		return 500;
	}
}

// Used to push elements to computer/user pattern arrays
function buildArr(elem, arr_name, isNumbers) {
	
	// Based on if arr_name is built from random numbers
	// Or user input
	var caseArray = [];
	if (isNumbers) {
		caseArray = [0, 1, 2, 3];
	} else {
		caseArray = ["green", "red", "yellow", "blue"];
	}

	// Push the appropriate element to the array
	switch(elem) {
		case caseArray[0]:
			arr_name.push("green");
			break;
		case caseArray[1]:
			arr_name.push("red");
			break;
		case caseArray[2]:
			arr_name.push("yellow");
			break;
		default:
			arr_name.push("blue");
			break;
	}
}

// Disables ability to click
function disableClick() {
	$(".quarter").css("pointer-events", "none");
	$(".switch").css("pointer-events", "none");
}

// Re-enables click
function enableClick() {
	$(".quarter").css("pointer-events", "auto");
	$(".switch").css("pointer-events", "auto");
}

// If power is turned off
function hardReset() {
	isPlaying = false;
	powerOn = false;
	incorrectPattern = false;
	strictReset = false;
	currentMoves = 0;
	maxMoves = 0;
	currentIteration = 0;
	mode = "standard";
	computerPattern = [];
	userPattern = [];
	$(".strictLight").removeClass("on");
}

// Soft reset for strict
function softReset() {
	strictReset = true;
	incorrectPattern = false;
	currentMoves = 0;
	maxMoves = 0;
	currentIteration = 0;
	computerPattern = [];
	userPattern = [];
}

/*****************
/* EVENT HANDLERS
******************/
$("#onOff").on("change", function() {
	
	// If board is "turned on"
	if($(this).is(":checked")) {
		$(".screenText").text("- -");
		powerOn = true;
	} else {  // Else reset
		$(".screenText").text("");
		hardReset();
	}
});

// Check if "power button" is on before allowing to play
$(".startButton").on("click", function() {
	
	if (powerOn && !isPlaying) {
		isPlaying = true;
		setTimeout(createBoard, 2000);
		setTimeout(function() {
			$(".screenText").text("RDY?");
		}, 500);
		setTimeout(function() {
			$(".screenText").text("GO!");
		}, 1500)
	}
});

// Enable/Disable strict mode
$(".strictButton").on("click", function() {

	if (powerOn) {
		if (mode === "standard") {
			mode = "strict";
			$(".strictLight").addClass("on");
		} else {
			mode = "standard";
			$(".strictLight").removeClass("on");
		}
	}
});

// Handles effects and logging on each game piece
$(".green, .red, .yellow, .blue").on("click", function() {
	
	var colorClicked = $(this)[0].className.replace("quarter ", "");
	
	// When user has input ability, log moves in userPattern arr
	logMoves(colorClicked);
	checkArr(colorClicked);
	if (currentMoves === maxMoves && !strictReset) {
		disableClick();
		userPattern = [];
		currentMoves = 0;
		currentIteration = 0;
		setTimeout(createBoard, 1000);
	} else {
		strictReset = false;
	}
});

// Lock piece clicks when page loads
$(document).ready(function() {
	$(".quarter").css("pointer-events", "none");
});
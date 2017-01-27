# simonGame

An implementation of the classic [Simon game](https://en.wikipedia.org/wiki/Simon_(game)).

The computer generates a random pattern of color presses, and the user must match the pattern.

### Game Modes
The game has a standard mode (default) and a strict mode (enabled with the strict button).  In the standard mode, the pattern will be repeated for the user if he/she gets it wrong.  In strict mode, the game will be reset back to 1.

### Winning

If the user is able to successfully repeat a pattern of 20, he/she wins, and the game is reset.

### Other Notes

The repeated pattern will pick up speed after the 5th, 9th, and 13th successful patterns are entered to increase the challenge.

The game can be turned on or off via the "power" switch.  Doing so will completely reset the game.

Live demo seen here:

[Github Pages](https://m-catha.github.io/simonGame/)

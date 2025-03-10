// Load boards from file or manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];


// create variables

var timer ;
var timeremaining ;
var lives ;
var selectedNum ;
var selectedTile ;
var disableSelect ;

window.onload = function() {
 // Run game start function when button is clicked
 id("start-btn").addEventListener("click",startGame);
 // Add event listener to each number in a number cointainer
 for( let i = 0 ; i < id("number-cointainer").children.length; i++ ) {
  id("number-cointainer").children[i].addEventListener("click", function() {
   // If selecting is not disabled 
   if(!disableSelect) {
     // if number is already selected
     if(this.classList.contains("selected")) {
     // Then remove the selection
     this.classList.remove("selected");
     selectedNum = null;
     } else {
       // Deselect all others numbers 
       for( i = 0; i < 9 ; i++ ) {
         id("number-cointainer").children[i].classList.remove("selected");
       }
       // Selected it and update selectedNum Variable 
       this.classList.add("selected");
       selectedNum = this;
       updateMove();
     }
   }
 });
 }

}

function startGame() {
// choose diffuculty
let board;
if(id("diff-2").checked) board = easy[0];
else if(id("diff-1").checked) board = medium[0];
else board = hard[0];
lives = 3;
disableSelect = false;
id("lives").textContent = "Lies Reamaining: 3";
generateBoard(board);
startTimer();
// sets theme based input
if(id("theme-1").checked ) {
  qs("body").classList.remove("dark");
}
else {
  qs("body").classList.add("dark");  
}
// show number cointainer
id("number-cointainer").classList.remove("hidden");
}

function startTimer()  {
// set Time remaining based on input
if(id("time-1").checked) timeremaining = 180;
else if(id("time-2").checked) timeremaining = 300;
else timeremaining = 600;
// Sets timer for first second
id("timer").textContent = timeConversion(timeremaining);
// sets timer to update to every second
timer = setInterval( function(){
timeremaining --;
// if no time remaing en the game
if(timeremaining === 0) endgame(); 
id("timer").textContent = timeConversion(timeremaining);
},1000)
}
// converts seconds to MM:SS format
function timeConversion(time) {
let minutes = Math.floor(time/60);
if(minutes < 10 ) minutes = "0" + minutes;
let seconds = time % 60 ;
if( seconds < 10  ) seconds = "0" + seconds;
return minutes + ':' + seconds; 
}

function generateBoard(board) {
// Clear Previous Boa
  clearPrevious();
// Lets use innocent title ids 
let idCount = 0;
// Create 81 tiles
for (let i=0; i<81; i++){
// Create  a  new Paragrph element
let tile = document.createElement("p");
//if the tile not suppose to be blank
if (board.charAt(i) != "-" ) {
// set tile text to the correct number
tile.textContent = board.charAt(i);
} else {
// Add click event listener to child
tile.addEventListener('click',function(){
  // If selecting not disabled 
  if(!disableSelect) {
  // If the tile is already selected 
  if(tile.classList.contains("selected")) {
    // Then remove selection 
    tile.classList.remove("selected");
    selectedTile = null; 
  } else {
    // Deselect all other tiles  
    for( i = 0 ; i < 81 ; i++ ){
     qsa(".tile")[i].classList.remove("selected");
     // Add selection and update variable  
     tile.classList.add("selected");
     selectedTile = tile;
     updateMove();
    }
  }
  }
});
}
// Assign the tile id 
tile.id = idCount;
// Increment for next tile
idCount++;
// Add tile class to to all tiles
tile.classList.add("tile");
if(( tile.id > 17 && tile.id < 27 ) || (tile.id > 44 && tile.id < 54 ) )  {
tile.classList.add("bottomBorder");
}
if((tile.id + 1) % 9 == 3 || (tile.id + 1 ) % 9 == 6 ) {
  tile.classList.add("rightBorder");
}
// Add the tile to Board
id("board").appendChild(tile);
} 
}

function updateMove() {
 // if tile and number is selected 
 if (selectedTile && selectedNum) {
 // Set the tile to the correct number
 selectedTile.textContent =  selectedNum.textContent
 // If the number matches the correct solution key 
 if(checkCorrect(selectedTile)) {
  // Deselected the tiles first 
  selectedTile.classList.remove("selected");
  selectedNum.classList.remove("selected");
  // Clear the selected variables
  selectedNum = null;
  selectedTile = null;
  // Check if the Board is completed
  if(checkDone()){
    endgame();  
  }
  //  If the number does not match the solution key
 } else {
  // Disable selecting new numbers for one second  
  disableSelect = true;
  // make the tile turn red 
  selectedTile.classList.add("incorrect");
  setTimeout(function() {
  // substract lives by one
  lives --;
  // if no lives left end the game
  if(lives === 0){
     endgame();
  } else {
  // if lives is not equal to zero 
  // Update lives text 
  id("lives").textContent = "Lives Remaining:"+lives;
 // Renables numbers and selecting tiles 
 disableSelect = false;  
}
// Restore tile color and number restore both
selectedTile.classList.remove("incorrect");
selectedTile.classList.remove("selected");
selectedTile.classList.remove("selected");
// clear the tiles texts and clear selected veriables
selectedTile.textContent = '';
selectedTile = null;
selectedNum = null; 
},1000);
}
} 
} 

function checkDone() {
  let tiles = qsa(".tile");
 for (i =0; i < tiles.length; i++ ) {
   if (tiles[i].textContent === "" ) return false;
 }
 return true;
}

function endgame() {
 // Disable moves and stop the timer 
 disableSelect = true ;
 clearTimeout(timer);
 // Display win or loss message 
 if( lives === 0 || timeremaining === 0 ) {
   id("lives").textContent = "Game Over";
 } else {
  id("lives").textContent = "You Won!";
 }
 
}

function checkCorrect(tile) {
// set solution based on duffficulty solution 
let solution;
if(id("diff-1").checked) solution = easy[1];
else if(id("diff-2").checked) solution = medium[1];
else solution = hard[1];
// If tiles number is equal to solution's number 
if(solution.charAt(tile.id) === tile.textContent ) return true;
else return false;
}

function clearPrevious() {
// Access all of the tiles  
let tiles = qsa(".tile");

// Remove each Tile
for (let i = 0; i < tiles.length; i++) {
tiles[i].remove();
}
// If there is a timer clean it 
if (timer) clearTimeout(timer);
for ( let i=0; i < id("number-cointainer").children.length; i++){
id("number-cointainer").children[i].classList.remove("selected");
} 

//Clear selected variables 
selectedTile = null;
selectedNum = null;
}
//heloer functions
function id(id) {

  return  document.getElementById(id);
}

function qs(selector){
return document.querySelector(selector);
}

function qsa(selector) {
return document.querySelectorAll(selector);
}
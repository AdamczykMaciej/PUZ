var clickedElId = ""
var firstChoice = ""
var howManyTimesPlayed = 0;
var howManySuccesses = 0;
var myTurn = 1;
function clickBox(el){
    document.getElementById("simulate").disabled = false;
    reset()
    el.style.backgroundColor = "green"
    clickedElId = el.id;
//    console.log("clicked")
}

function reset(){
    var elements = document.getElementsByClassName("box");
    [...elements].forEach(e=>{e.style.backgroundColor = "white"});
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetGame(){
    var elements = document.getElementsByClassName("box");
    [...elements].forEach(e=>{e.style.backgroundColor = "white";e.disabled=false;e.innerHTML='';});
    clickedElId = ""
    firstChoice = ""
    myTurn=1;
    document.getElementById("simulate").disabled = true;
    document.getElementById("1").innerHTML = "1"
    document.getElementById("2").innerHTML = "2"
    document.getElementById("3").innerHTML = "3"
    document.getElementById("result").innerHTML = ""
}

function disableBoxes(){
var boxes = document.querySelectorAll(".box");
[...boxes].forEach(e=>{e.disabled = true})
}

function resultWon(boxId){
    howManySuccesses+=1;
    howManyTimesPlayed+=1;
//            document.getElementById("result").text = "You won!";
    document.getElementById(boxId).innerHTML = "<img src='/static/images/ferrari.png'>";
    document.getElementById("won-num").innerHTML = howManySuccesses;
    document.getElementById("played-num").innerHTML = howManyTimesPlayed;
    disableBoxes();
    document.getElementById("simulate").disabled = true;
    document.getElementById("result").innerHTML = "You won!";
    document.getElementById("result").style.color = "green";
}

function resultLost(){
    howManyTimesPlayed+=1;
//            document.getElementById("result").text = "You lost...";
    document.getElementById("played-num").innerHTML = howManyTimesPlayed;
    disableBoxes();
    document.getElementById("simulate").disabled = true;
    document.getElementById("result").innerHTML = "You lost!";
    document.getElementById("result").style.color = "red";
}

function updatePercentageOfWon(){
    var played = document.getElementById("played-num").innerHTML;
    var won = document.getElementById("won-num").innerHTML = howManySuccesses;
    var result = parseInt(won).toFixed(2)/parseInt(played).toFixed(2)*100.0
    document.getElementById("won-percent").innerHTML = result.toFixed(2)+"%"

}

function simulate(){
    if(myTurn===1){
        price = randomInteger(1,3) // 0 - in the box chosen by the user, 1 - in the other box
//        console.log("price: box:",price)
        firstChoice = document.getElementById(clickedElId);
        firstChoice.disabled = true;
        var boxes = document.querySelectorAll(".box");
        var leftBoxes = [];

        montyHallChoice = 0;

        var inds= [0,1,2]
        if(price === parseInt(clickedElId)){
            inds = inds.filter(item => item !== parseInt(clickedElId-1));
            montyHallChoice = boxes[inds[randomInteger(0,1)]];
        }
        else{
        // 5 to sum of ids of boxes -1 (correction for index in the array (starts from 0))
            montyHallChoice = boxes[5-price - parseInt(clickedElId)]
        }
        montyHallChoice.innerHTML = "<img src='/static/images/goat.png'>";
        montyHallChoice.disabled = true;
        firstChoice.disabled = false;

        myTurn+=1;
     } else if(myTurn===2){
        secondChoice = document.getElementById(clickedElId);
        secondChoice.disabled = true;
        if(price === parseInt(clickedElId)){
            resultWon(price);
        } else{
            resultLost();
        }
        updatePercentageOfWon();
     }
}
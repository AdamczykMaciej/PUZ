var clickedElId = ""
var firstChoice = ""
var howManyTimesPlayed = 0;
var howManySuccesses = 0;
var myTurn = 1;
var inds= [0,1,2]
function clickBox(el){
    document.getElementById("simulate").disabled = false;
    reset()
    el.style.backgroundColor = "green"
    clickedElId = el.id;
//    console.log("clicked")
}

function reset(){
    let elements = document.getElementsByClassName("box");
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
    document.getElementById("reset").disabled = true;
    document.getElementById("1").innerHTML = "1"
    document.getElementById("2").innerHTML = "2"
    document.getElementById("3").innerHTML = "3"
    document.getElementById("result").innerHTML = ""
    inds = [0,1,2]
}

function disableBoxes(){
    let boxes = document.querySelectorAll(".box");
    [...boxes].forEach(e=>{e.disabled = true})
}

function resultWon(priceId, leftId){
    howManySuccesses+=1;
    howManyTimesPlayed+=1;
//            document.getElementById("result").text = "You won!";
    document.getElementById(priceId).innerHTML = "<img src='/static/images/ferrari.png'>";
    document.getElementById(leftId+1).innerHTML = "<img src='/static/images/goat.png'>";
    document.getElementById("won-num").innerHTML = howManySuccesses;
    document.getElementById("played-num").innerHTML = howManyTimesPlayed;
    disableBoxes();
    document.getElementById("simulate").disabled = true;
    document.getElementById("result").innerHTML = "You won!";
    document.getElementById("result").style.color = "green";
    document.getElementById("reset").disabled = false;
}

function resultLost(priceId, userChoiceId){
    howManyTimesPlayed+=1;
    document.getElementById(price).innerHTML = "<img src='/static/images/ferrari.png'>";
    document.getElementById(userChoiceId).innerHTML = "<img src='/static/images/goat.png'>";
    document.getElementById("played-num").innerHTML = howManyTimesPlayed;
    disableBoxes();
    document.getElementById("simulate").disabled = true;
    document.getElementById("result").innerHTML = "You lost!";
    document.getElementById("result").style.color = "red";
    document.getElementById("reset").disabled = false;
}

function updatePercentageOfWon(){
    let played = document.getElementById("played-num").innerHTML;
    let won = document.getElementById("won-num").innerHTML = howManySuccesses;
    let result = parseInt(won).toFixed(2)/parseInt(played).toFixed(2)*100.0
    document.getElementById("won-percent").innerHTML = result.toFixed(2)+"%"
}

function simulate(){
    if(myTurn===1){
        price = randomInteger(1,3) // 0 - in the box chosen by the user, 1 - in the other box
//        console.log("price: box:",price)
        firstChoice = document.getElementById(clickedElId);
        firstChoice.disabled = true;
        let boxes = document.querySelectorAll(".box");
        let leftBoxes = [];

        montyHallChoice = 0;

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
            leftId = inds.filter(item => item !== montyHallChoice);
            resultWon(price, leftId[0]);
        } else{
            resultLost(price, clickedElId);
        }
        updatePercentageOfWon();
     }
}

function updateLeaderboard(){
     $.post("/api/updateLeaderboard",
  {
    name: document.getElementById("name").value,
    score: document.getElementById("won-percent").innerHTML
  },
  function(data, status){
    console.log("Data: " + data + "\nStatus: " + status);
  });
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  let head = ["Name","Score"]
  for (let key of head) { // data
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
    let dict = [];
    for (let key in data){
        dict.push({key:key, value: data[key]});
    }
    //data
  for (let element of dict) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

function getLeaderboard() {
  $.get("/api/getLeaderboard",function(data, status){
        $("table tr").remove();
        data = JSON.parse(data);
      let table = document.querySelector("table");
      console.log("Load leaderboard");
      generateTableHead(table, Object.keys(data));
      generateTable(table, data);
    });
}

$( document ).ready(getLeaderboard());

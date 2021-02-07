var clickedElId = ""
var firstChoice = ""
var howManyTimesPlayed = 0;
var howManySuccesses = 0;
var myTurn = 1;
var possibleIds = [1,2,3]
var montyId = 0

function toggleBox(element) {
  element.classList.toggle("boxOpen");
}

function clickBox(el){
    document.getElementById("simulate").disabled = false;
    reset()
    el.style.backgroundColor = "white";
    el.style.color = "yellow";
    el.innerHTML = "Selected";
//    el.style.textDecoration = "underline";
    clickedElId = el.id;
}

function reset(){
    let elements = document.getElementsByClassName("box");
    [...elements].forEach(e=>{e.style.backgroundColor = "white";e.style.color = "white"; e.style.textDecoration="unset"; e.innerHTML = e.id;});
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetGame(){
    let elements = document.getElementsByClassName("box");
    let backDoors = document.getElementsByClassName("backDoor");
    [...backDoors].forEach(e=>{e.style.backgroundColor = "#333"});
    [...elements].forEach(e=>{e.style.backgroundColor = "white";e.disabled=false;e.innerHTML='';});
    clickedElId = ""
    firstChoice = ""
    myTurn=1;
    document.getElementById("simulate").disabled = true;
    document.getElementById("reset").disabled = true;
    let box1 = document.getElementById("1");
    let box2 = document.getElementById("2");
    let box3 = document.getElementById("3");
    box1.innerHTML = "1"
    box2.innerHTML = "2"
    box3.innerHTML = "3"
    toggleBox(box1);
    toggleBox(box2);
    toggleBox(box3);
    document.getElementById("result").innerHTML = ""
    possibleIds = [1,2,3]
}

function disableBoxes(){
    let boxes = document.querySelectorAll(".box");
    [...boxes].forEach(e=>{e.disabled = true})
}

function resultWon(priceId, leftId){
    howManySuccesses+=1;
    howManyTimesPlayed+=1;
    toggleBox(document.getElementById(priceId));
    toggleBox(document.getElementById(leftId));
    document.getElementById("backDoor"+priceId).style.backgroundImage = "url(/static/images/ferrari.png)";
    document.getElementById("backDoor"+leftId).style.backgroundImage = "url(/static/images/goat.png)";
    document.getElementById("backDoor"+priceId).style.backgroundColor = "green";
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
    toggleBox(document.getElementById(priceId));
    toggleBox(document.getElementById(userChoiceId));
    document.getElementById("backDoor"+price).style.backgroundImage = "url(/static/images/ferrari.png)";
    document.getElementById("backDoor"+userChoiceId).style.backgroundImage = "url(/static/images/goat.png)";
    document.getElementById("backDoor"+userChoiceId).style.backgroundColor = "#DC143C"
    document.getElementById(userChoiceId).style.backgroundColor = "#dc3545";
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
        price = randomInteger(1,3)
        firstChoice = document.getElementById(clickedElId);
        firstChoice.disabled = true;
        let boxes = document.querySelectorAll(".box");
        let leftBoxes = [];
        let boxIds = [1,2,3]
        let montyHallChoice = 0;

        if(price === parseInt(clickedElId)){
            possibleIds = boxIds.filter(item => item !== parseInt(clickedElId));
            montyId  = possibleIds[randomInteger(0,1)]-1;
            montyHallChoice = boxes[montyId];
            possibleIds = boxIds.filter(item => item !== montyId + 1)
        }
        else{
            possibleIds = boxIds.filter(item => item !== parseInt(clickedElId) && item !== price);
            montyId =  possibleIds[0]-1
            montyHallChoice = boxes[montyId]
            possibleIds = boxIds.filter(item => item !== montyId + 1)
        }
        toggleBox(montyHallChoice);
        montyBackDoor = document.getElementById("backDoor"+(montyId+1));
        montyBackDoor.style.backgroundImage = "url(/static/images/goat.png)";
        montyHallChoice.disabled = true;
        firstChoice.disabled = false;

        myTurn+=1;
     } else if(myTurn===2){
        if(price === parseInt(clickedElId)){
            leftId = possibleIds.filter(item => item != price)
            resultWon(price, leftId[0], clickedElId);
        } else{
            resultLost(price, clickedElId);
        }
        updatePercentageOfWon();
     }
     if(howManyTimesPlayed === 10){
        document.getElementById("submit").disabled = false;
     }
}

function updateLeaderboard(){
    if(howManyTimesPlayed === 10){
     $.post("/api/updateLeaderboard",
  {
    name: document.getElementById("name").value,
    score: document.getElementById("won-percent").innerHTML,
    games: document.getElementById("played-num").innerHTML
  },
  function(data, status){
    console.log("Data: " + data + "\nStatus: " + status);
  });
  } else{
    console.log("You have to play 10 games")
  }
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
//  let head = ["Name","Score", "Games"]
  for (let key of data) { // data
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
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
      generateTableHead(table, Object.keys(data[0]));
      generateTable(table, data);
    });
}

getLeaderboard();

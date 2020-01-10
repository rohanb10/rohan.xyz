var players = [];
const table = document.getElementById('score');
var scores = [];

function newGame() {
	var numberOfPlayers;
	while (isNaN(numberOfPlayers)) {
		numberOfPlayers = prompt("How many players?");
	}
	if (numberOfPlayers <= 0 || numberOfPlayers > 20) {
		return false;
	}
	var header = table.insertRow(-1);
	for (var i = 0; i < numberOfPlayers; i++) {
		var p = prompt("Player #" + (i + 1) + " name?");
		players.push(p);
		scores.push(0);
		var cell = document.createElement("th");
		cell.innerHTML = p;
		header.appendChild(cell);
	}
	document.getElementById('ng').classList.add('hidden');
	document.getElementById('nr').classList.remove('hidden');
}

function newRound() {
	var row = table.insertRow();
	for (var i = 0; i < players.length; i++) {
		var s;
		while (isNaN(s)) {
			s = prompt(players[i] + " score for this round?");
		}
		var total = parseInt(scores[i]) + parseInt(s);
		var cell = row.insertCell();
		
		if (total === 50) {
			total = 25;
			cell.innerHTML = "<strike>50</strike>&nbsp"+total;
		} else if (total === 100) {
			total = 50;
			cell.innerHTML = "<strike>100</strike>&nbsp"+total;
		} else {
			cell.innerHTML = total;	
		}

		scores[i] = total;
		s = "yo";
	}
}
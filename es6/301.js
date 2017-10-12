var hostname = "192.168.4.202";
var port = 1884;


var GameSettings = {
    Players:2,
    DoubleIn:false,
    DoubleOut:true,
    StartValue:301
}

// Game settings

// Create a client instance
var client = new Paho.MQTT.Client(hostname, Number(port), "client"+Math.random());

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var currentPlayer = 1;
var currentTurn = 1;

// connect the client
client.connect({
    onSuccess: onConnect
});


function getGameTypeString(gameSettings)
{
    var s = gameSettings.StartValue;
    if (!gameSettings.DoubleIn && gameSettings.DoubleOut)
        s += " DOUBLE OUT";
    else if(gameSettings.DoubleIn && gameSettings.DoubleOut)
        s += " DOUBLE IN & OUT";
    return s;
}

function cycleLevel(gameSettings)
{
    // none->double out->double in and out
    if (!gameSettings.DoubleIn && !gameSettings.DoubleOut) {
        gameSettings.DoubleOut = true;
    }
    else if (!gameSettings.DoubleIn && gameSettings.DoubleOut) {
        gameSettings.DoubleIn = true;
    }
    else {
        gameSettings.DoubleIn = false;
        gameSettings.DoubleOut = false;
    }
    setGameTypeText(getGameTypeString(gameSettings));
}

function newRound(playerIdx, turnIdx, score)
{
//    $("#player" + playerIdx).createElement()
    var id = "player" + playerIdx;
    var player = document.getElementById(id);

    var entry = document.createElement("div");
    var score = document.createTextNode(score);
    entry.appendChild(score);   
    player.appendChild(entry);

    return entry;
}

function setStatusText(statusText)
{
    var se = document.getElementById("statustext")
    se.childNodes[0].nodeValue = statusText;
}

function setGameTypeText(gtText)
{
    var gte = document.getElementById("gametype");
    gte.childNodes[0].nodeValue = gtText;
}


function setup()
{
    for (i = 1; i <= GameSettings.Players; i++)
        newRound(i, 1, GameSettings.StartValue);
    setGameTypeText(getGameTypeString(GameSettings));
    setStatusText("Player 1 up: " + GameSettings.StartValue);

}

function onLoad()
{
    console.log("onSetup");
    setup();
    replayMessages();
}


// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("dart01/hits");
    client.subscribe("dart01/buttons");
    send();
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function strikethroughFirst(element)
{
    var e = element.removeChild(element.firstChild);
    console.log(e);
    var strikethrough=document.createElement("del");
    strikethrough.appendChild(e);
    element.insertBefore(strikethrough, element.childNodes[0]);
}

function isDouble(rawscore)
{
    var parts = rawscore.split(",");
    if (parts.length != 3)
        return false;
    return parts[2] === "2";
}

function calcScore(rawscore)
{
    var parts = rawscore.split(",");
    if (parts.length != 3)
        return 0;
    var value = parseInt(parts[0]);
    var mult = parseInt(parts[1]);

    // Correct for ESP firmwarebug
    if (value == 50)
        value = 25;

    return value * mult;
}

function applyScore(column, score)
{
    // Fetch last value
    var last=column.lastChild;
    console.log(last);
}

function getTurnElement(playerIdx,turnIdx)
{
    // Turn element: first value is initial score, up to three values for throws
    var playerid = "player" + playerIdx;
    element = document.getElementById(playerid);
    return element.childNodes[turnIdx - 1];
}

function initialTurnScore(turn)
{
    return parseInt(turn.firstChild.data);
}

function calcTurnScoreNoCheck(turn)
{
    var score = initialTurnScore(turn);

    for(i=1;i<turn.childNodes.length;i++)
        score = score - parseInt(turn.childNodes[i].data);

    return score;
    // Calculate all registered hits for turn and perform simple summation
    // Assume any rules for valid hits are applied elsewhere
}

function removeLastHit(turn)
{
    if (turn.childNodes.length > 1)
        turn.removeChild(turn.lastChild);
    
}

function nextPlayer(hasBusted)
{
    currentPlayer++;
    if(currentPlayer>GameSettings.Players)
    {
        currentPlayer = 1;
        currentTurn = currentTurn+1;
    }
    var turn = getTurnElement(currentPlayer, currentTurn);
    var turnscore = calcTurnScoreNoCheck(turn);
    setStatusText("Player "+currentPlayer + " up:  " + turnscore);
}


function applyValue(playeridx, turnidx,value,isdouble)
{
    var turn = getTurnElement(playeridx, turnidx);

    var initialscore = initialTurnScore(turn);

    if (GameSettings.DoubleIn && initialscore == GameSettings.StartValue && !isdouble)
        value = 0;

    var node = document.createTextNode(" " + value);
    turn.appendChild(node);
    var turnscore = calcTurnScoreNoCheck(turn);

    setStatusText("Player " + playeridx + " up:  " + turnscore);

    // If START_VALUE, require double to get started

    if (turnscore == 0 && (!GameSettings.DoubleOut || isdouble == true))
    {
        //Declare winner!
        newRound(playeridx, turnidx + 1, "Winner!");
    }
    else if (turnscore <= 0 || (turnscore == 1 && GameSettings.DoubleOut))
    {
        // Bust
        strikethroughFirst(turn);
        newRound(playeridx, turnidx + 1, initialscore);
        nextPlayer(true);
    }
    else if(turn.childNodes.length==4)
    {
        // Turn over
        strikethroughFirst(turn);
        newRound(playeridx, turnidx + 1, turnscore);
        nextPlayer(false);
    }
}

function resetScores()
{
    for (i = 1; i <= GameSettings.Players; i++)
    {
        $("#player" + i).empty();
    }
    currentPlayer = 1;
    currentTurn = 1;
}


function processHit(payloadString)
{
    var rawscore = payloadString;
    var score = calcScore(rawscore);
    var double = isDouble(rawscore);
    applyValue(currentPlayer, currentTurn, score, double);
}

function processButton(payloadString)
{
    if (payloadString == "4") {
        // 301
        GameSettings.StartValue = 301;
        resetScores();
        setup();
        localStorage.clear();   // Kill message log
        return;
    }
    if (payloadString == "5") {
        // # players
        resetScores();
        GameSettings.Players++;
        if (GameSettings.Players > 4)
            GameSettings.Players = 1;
        setup();
        return;
    }
    if (payloadString == "6") {
        // Next player
        var turn = getTurnElement(currentPlayer, currentTurn);
        var turnscore = calcTurnScoreNoCheck(turn);
        strikethroughFirst(turn);
        newRound(currentPlayer, currentTurn + 1, turnscore);
        nextPlayer(false);
    }
    if (payloadString == "7") {
        // Solo play
        resetScores();
        GameSettings.Players = 1;
        setup();
        return;
    }
    if (payloadString == "13") {
        // Game level
        cycleLevel(GameSettings);
        return;
    }
    if (payloadString == "8") {
        if (GameSettings.StartValue == 301)
            GameSettings.StartValue = 501;
        else
            GameSettings.StartValue = 301;
        resetScores();
        setup();
    }
    if (payloadString == "9") {
        // BounceOut/amend
        var turn = getTurnElement(currentPlayer, currentTurn);

        // If remove last if any registered hits on current player turn
        removeLastHit(turn);

        var turnscore = calcTurnScoreNoCheck(turn);
        setStatusText("Player " + currentPlayer + " up:  " + turnscore);
    }
    if (payloadString == "11") {
        // Miss
        var score = 0;
        var double = false;
        applyValue(currentPlayer, currentTurn, score, double);
        return;
    }
}


var messageIndex = 1;

function replayMessages()
{
    messageIndex = 1;
    while (true)
    {
        var hit = localStorage.getItem("h_" + messageIndex);       
        var btn = localStorage.getItem("b_" + messageIndex);

        if (hit != null)
            processHit(hit);
        else if (btn != null)
            processButton(btn);
        else
            return;

        messageIndex++;
    }
}



function recordMessage(name, payload)
{
    if (typeof(Storage) !== "undefined") 
    {
        s="";
        if (name == "dart01/hits")
            s = "h_" + messageIndex++;
        if(name == "dart01/buttons")
            s = "b_" + messageIndex++;
        localStorage.setItem(s, payload);       
    } else {
        // Sorry! No Web Storage support..
    }
}

function processMessage(name, payload, record)
{
    if (record)
        recordMessage(name, payload);
    if (name == "dart01/hits")
        processHit(payload);
    else if (name == "dart01/buttons")
        processButton(payload);

}


// called when a message arrives
function onMessageArrived(message) {
    var s="Message arrived: topic=" + message.destinationName + ", message=" + message.payloadString;
    console.log(s);
    processMessage(message.destinationName,message.payloadString,true);
}

function send() {
    if (!client) {
        return;
    }
    var message = new Paho.MQTT.Message("Dart client ready");
    message.destinationName = "dart01/info";
    client.send(message);
}

var d2gsi = require("dota2-gsi");
var server = new d2gsi();
var fs = require('fs');

var clients = [];


server.events.on('newclient', function(client) {
    console.log("New client connection, IP address: " + client.ip + ", Auth token: " + client.auth);
	clients.push(client);

    client.on('map:roshan_state', function(roshan_state) {
        console.log("Rosh is now: " + roshan_state);
		if (client.gamestate.map.roshan_state == "respawn_base") {
			console.log("Roshan taken, Respawn in 8-11 minutes");
		}
		else if (client.gamestate.map.roshan_state == "respawn_variable"){
			var timer = client.gamestate.map.roshan_state_end_seconds
			console.log("Rosh now in variable state, will respawn in: " + timer + " seconds!");
			console.log("That is " + Math.floor(timer / 60 ) + " minutes and " + (timer % 60) + " seconds!");
		}
    });
    RuneCheck(client);
});

setInterval(function () {
    
		clients.forEach(function(client) {
            if (client.gamestate.map != null) {
                if (client.gamestate.map.roshan_state != "alive" && client.gamestate.map.win_team == "none") {
                    RoshRespawnHandle(client);
                }
                else fs.writeFileSync('RoshTimer.txt', "");
            }
		});
}, .5 * 1000); // Every left seconds

function RoshRespawnHandle(client) {
    var respawnTimer = client.gamestate.map.roshan_state_end_seconds;
    var respawnMinutes = Math.floor(respawnTimer / 60);
    var respawnSeconds = (respawnTimer % 60);
    var readableRespawnSeconds = LeadPad(respawnSeconds);
    var readableTimer = respawnMinutes + ":" + readableRespawnSeconds;
    //console.log("Respawn Timer = " + respawnTimer)
    //console.log(respawnMinutes + ":" + readableRespawnSeconds + " (" + respawnSeconds + ")")
    fs.writeFileSync('RoshTimer.txt', readableTimer);
}


function LeadPad(num) {
    num = num.toString();
    while (num.length < 2) num = "0" + num;
    return num;
}

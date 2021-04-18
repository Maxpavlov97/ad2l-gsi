var d2gsi = require("dota2-gsi");
var server = new d2gsi();
var fs = require('fs');

var clients = [];

var respawnTime;

server.events.on('newclient', function(client) {
    console.log("New client connection, IP address: " + client.ip + ", Auth token: " + client.auth);
	clients.push(client);

    //looks for a roshan_state update
    client.on('map:roshan_state', function(roshan_state) {
        console.log("Rosh is now: " + roshan_state);
        //base respawn time (8 minutes)
		if (client.gamestate.map.roshan_state == "respawn_base") {
            console.log("Roshan taken, Respawn in 8-11 minutes");
            respawnTime = 480
        }
        //variable respawn (8-11)
        else if (client.gamestate.map.roshan_state == "respawn_variable") {
            respawnTime = client.gamestate.map.roshan_state_end_seconds
		}
    });
});

//Re-run this function
setInterval(function () {
        if (respawnTime > 0) {
            RoshTimerHandle();
            respawnTime--;
        }
        else {
            fs.writeFileSync('RoshTimer.txt', '');
        }

}, 1 * 1000); // Every second decrement timer


function RoshTimerHandle() {
    var respawnMinutes = Math.floor(respawnTime / 60);
    var respawnSeconds = (respawnTime % 60);
    var readableRespawnSeconds = LeadPad(respawnSeconds);
    var readableTimer = respawnMinutes + ":" + readableRespawnSeconds;
    fs.writeFileSync('RoshTimer.txt', readableTimer);
}

//this adds a leading 0 to a number if it is under 10. e.g. if timer is 1 minute and 9 seconds it will return 09
//by default text output would read 10:9.
function LeadPad(num) {
    num = num.toString();
    while (num.length < 2) num = "0" + num;
    return num;
}

server.events.on('newclient', function (client) {
	console.log("New client connection, IP address: " + client.ip + ", Auth token: " + client.auth);
	clients.push(client);
	RuneCheck(client);
});

function RuneCheck(client) {
    client.on('player:team2:player0:runes_activated', function (runes_activated) {
        RuneIdentifier(0, client);
    });
    client.on('player:team2:player1:runes_activated', function (runes_activated) {
        RuneIdentifier(1, client);
    });
    client.on('player:team2:player2:runes_activated', function (runes_activated) {
        RuneIdentifier(2, client);
    });
    client.on('player:team2:player3:runes_activated', function (runes_activated) {
        RuneIdentifier(3, client);
    });
    client.on('player:team2:player4:runes_activated', function (runes_activated) {
        RuneIdentifier(4, client);
    });
    client.on('player:team3:player5:runes_activated', function (runes_activated) {
        RuneIdentifier(5, client);
    });
    client.on('player:team3:player6:runes_activated', function (runes_activated) {
        RuneIdentifier(6, client);
    });
    client.on('player:team3:player7:runes_activated', function (runes_activated) {
        RuneIdentifier(7, client);
    });
    client.on('player:team3:player8:runes_activated', function (runes_activated) {
        RuneIdentifier(8, client);
    });
    client.on('player:team3:player9:runes_activated', function (runes_activated) {
        RuneIdentifier(9, client);
    });
}

function RuneIdentifier(playernumber, client) {

    var player;
    var teamPlayer;
    var hero;
    var runeType

    var clockTime = Math.floor(client.gamestate.map.clock_time / 60) + ":" + LeadPad(client.gamestate.map.clock_time % 60)

    if (playernumber < 5) {
        player = "client.gamestate.player.team2.player" + playernumber.toString();
        teamPlayer = "client.gamestate.hero.team2.player" + playernumber.toString();
    }
    else if (playernumber >= 5) {
        player = "client.gamestate.player.team3.player" + playernumber.toString();
        teamPlayer = "client.gamestate.hero.team3.player" + playernumber.toString();
    }

    var xpos = eval((teamPlayer + ".xpos"));
    var ypos = eval(teamPlayer + ".ypos");
    if (NearTo(xpos, -4200) && NearTo(ypos, -200)) {
        runeType = "top hill bounty rune"
    }
    else if (NearTo(xpos, -3800) && NearTo(ypos, 2500)) {
        runeType = "top river bounty rune";
    }
    else if (NearTo(xpos, 3900) && NearTo(ypos, -2500)) {
        runeType = "bot river bounty rune";
    }
    else if (NearTo(xpos, 3200) && NearTo(ypos, -500)) {
        runeType = "bot hill bounty rune";
    }
    else if (NearTo(xpos, -1600) && NearTo(ypos, 1100)) {
        runeType = "picked up top power rune";
    }
    else if (NearTo(xpos, 1100) && NearTo(ypos, -1100)) {
        runeType = "picked up bot power rune";
    }
    else {
        runeType = "shovel bounty rune";
    }


    console.log((eval(teamPlayer + ".name")) + " has picked up " + runeType + " at position " +
        eval((teamPlayer + ".xpos")) + "," + eval((teamPlayer + ".ypos")) + " at " + clockTime);


    //Top hill rune = -4000, -200
    //Top river rune = -3800, 2500
    //Bottom river rune = 3900, -2500
    //Bottom hill rune = 3200, -500

}


function NearTo(x, target) {
    var variance = 400;
    return x >= (target - variance) && x <= (target + variance);
}

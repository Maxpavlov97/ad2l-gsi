const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fetch = require("node-fetch");

var d2gsi = require("dota2-gsi");
var server = new d2gsi();
var playerranks;
var client_g;
const authorizedToken = "stagedWeek4112";

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  if (playerranks) {
    socket.emit("playerRanks", playerranks);
    socket.emit("currentDraft", client_g.gamestate.draft);
  }
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(6998, () => {
  console.log("listening on *:6998");
});

function send(type, data) {
  //console.log("sending " + JSON.stringify(obj));
  io.emit(type, data);
}

//events
server.events.on("newclient", function (client) {
  console.log(
    "New client connection, IP address: " + client.ip + ", Auth token: "
  );
  console.log(client.auth);
  if (client.auth.token != authorizedToken) {
    console.log("NOT AUTHORIZED");
    return;
  }

  client_g = client;

  // console.log("calling getranks from client start");
  // getRanks(client).then((r) => {
  //   playerranks = r;
  //   send("playerRanks", r);
  // });

  var initialized = false;
  client.on("draft:activeteam", function (e) {
    send("activeteam", e);
    if (!initialized) {
      initialized = true;
      console.log("calling getranks from draft");
      getRanks(client).then((r) => {
        playerranks = r;
        send("playerRanks", r);
      });
    }
  });

  client.on("draft:activeteam_time_remaining", function (e) {
    send("activeteam_time_remaining", e);
  });

  client.on("draft:dire_bonus_time", function (e) {
    send("dire_bonus_time", e);
  });
  client.on("draft:radiant_bonus_time", function (e) {
    send("radiant_bonus_time", e);
  });
  client.on("draft:pick", function (e) {
    send("pick/ban", e);
  });

  //Event Listeners for hero picks and bans\
  for (var team = 2; team <= 3; team++) {
    //team2 == radiant, team3 == dire
    for (var pick = 0; pick < 5; pick++) {
      //picks 0-4, 5 total
      let eventType = "draft:team" + team + ":pick" + pick + "_class";
      if (team == 2)
        client.on(
          eventType,
          (function (e) {
            var num = pick;
            return function (e) {
              send("pick", { team: "radiant", value: e, num: num });
            };
          })()
        );
      if (team == 3)
        client.on(
          eventType,
          (function (e) {
            var num = pick;
            return function (e) {
              send("pick", { team: "dire", value: e, num: num });
            };
          })()
        );
    }
    for (var ban = 0; ban < 7; ban++) {
      //bans 0-6, 7 total
      let eventType = "draft:team" + team + ":ban" + ban + "_class";
      if (team == 2)
        client.on(
          eventType,
          (function (e) {
            var num = ban;
            return function (e) {
              send("ban", { team: "radiant", value: e, num: num });
            };
          })()
        );
      if (team == 3)
        client.on(
          eventType,
          (function (e) {
            var num = ban;
            return function (e) {
              send("ban", { team: "dire", value: e, num: num });
            };
          })()
        );
    }
  }
});

async function getRanks(client) {
  console.log("fetching ranks");
  let playersRanks = [];
  for (var team in client.gamestate.player) {
    team = client.gamestate.player[team];
    for (var player in team) {
      player = team[player];
      const url =
        "https://api.opendota.com/api/players/" + steamID(player.steamid);
      let response = await fetch(url);
      response = await response.json();
      playersRanks.push({
        ProName: player.name,
        PubName: response.profile.personaname,
        avatar: response.profile.avatarfull,
        rank: rankTier(response.rank_tier),
        leaderboard: response.leaderboard_rank,
      });
    }
  }
  return playersRanks;
}
/**
 * parses the rank_tier number from opendota
 * @param {Number} rankTier
 * @returns "{medal:'',stars:0}"
 */
function rankTier(rankTier) {
  const ranks = [
    "Unranked",
    "Herald",
    "Guardian",
    "Crusader",
    "Archon",
    "Legend",
    "Ancient",
    "Divine",
    "Immortal",
  ];
  return { medal: ranks[Math.floor(rankTier / 10)], stars: rankTier % 10 };
}
/**
 * Converts steam64 to steam32
 * @param {Number} steamID64
 * @returns steamID32
 */
function steamID(steamID64) {
  steamID64 += "";
  var steamID32 = steamID64.substring(7);
  steamID32 -= 7960265728;
  return steamID32;
}

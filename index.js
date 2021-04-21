const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const fetch = require("node-fetch");

var d2gsi = require("dota2-gsi");
var server = new d2gsi({
  port: 12354,
  //ip:
  tokens: ["maxtest"],
});

const GsiHandler = require("./my_modules/main");
var Handler;

app.use(express.static("frontend"));

//display website connects
io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);
  catchUpClientDraft(socket);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(6998, () => {
  console.log("listening on *:6998");
});

//events
//dota events connect
server.events.on("newclient", function (client) {
  console.log(
    "New client connection, IP address: " + client.ip + ", Auth token: "
  );
  console.log(client.auth);
  Handler = new GsiHandler(client, io);
    var draftHandler = new (require("./my_modules/draft"))(Handler);
    var RoshanHandler = new (require("./InGame/Roshan"))(Handler);

  // console.log("calling getranks from client start");
  // getRanks(client).then((r) => {
  //   playerranks = r;
  //   send("playerRanks", r);
  // });
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

function catchUpClientDraft(socket) {
  // var draft = Handler.input.gamestate.draft;
  // customSend("activeteam_time_remaining", draft.activeteam_time_remaining);
  // customSend("radiant_bonus_time", draft.radiant_bonus_time);
  // customSend("dire_bonus_time", draft.dire_bonus_time);
}

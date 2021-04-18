const socket = io();

const cdn = "http://cdn.dota2.com/apps/dota2/images/heroes/";
const cdn_end = "_full.png";

var pick = false;
var radiantBanNum = 0;
var radiantPickNum = 0;
var direBanNum = 0;
var direPickNum = 0;
var activeTeam;

socket.on("pick", (e) => {
  console.log(e);
  if (e.value)
    document.getElementById(e.team + "pick" + e.num).src =
      cdn + e.value + cdn_end;
  else document.getElementById(e.team + "pick" + e.num).src = "./img/empty.png";

  if (e.team == "radiant") radiantPickNum = e.num + 1;
  if (e.team == "dire") direPickNum = e.num + 1;
  changeSelection();
});
socket.on("ban", (e) => {
  console.log(e);
  if (e.value)
    document.getElementById(e.team + "ban" + e.num).src =
      cdn + e.value + cdn_end;
  else document.getElementById(e.team + "ban" + e.num).src = "./img/empty.png";

  if (e.team == "radiant") radiantBanNum = e.num + 1;
  if (e.team == "dire") direBanNum = e.num + 1;
  changeSelection();
});
socket.on("activeteam_time_remaining", (e) => {
  //console.log(e);
  document.getElementById("draft_clock").textContent = time(e);
});

socket.on("activeteam", (e) => {
  if (e == 2) activeTeam = "radiant";
  else activeTeam = "dire";
  console.log(activeTeam);
  if (radiantBanNum == 0 && direBanNum == 0) changeSelection();
});
socket.on("radiant_bonus_time", (e) => {
  document.getElementById("radiant_bonus_time").textContent = time(e);
});
socket.on("dire_bonus_time", (e) => {
  document.getElementById("dire_bonus_time").textContent = time(e);
});
socket.on("pick/ban", (e) => {
  pick = e;
  if (e) console.log("pick");
  else console.log("ban");
});

socket.on("playerRanks", (e) => {
  // ProName: '',
  // PubName: '',
  // avatar: 'https://',
  // rank: { medal: 'Ancient', stars: 4 },
  // leaderboard:
  console.log(e);
  const rankBaseUrl = "http://ad2l.s3-website-us-east-1.amazonaws.com/img/";
  for (var i = 0; i < e.length; i++) {
    const player = e[i];
    const playerAvatarElement = document.getElementById(
      "player" + i + "_avatar"
    );
    const playerRankElement = document.getElementById("player" + i + "_rank");
    const playerNameElement = document.getElementById("player" + i + "_name");

    //rank
    let badge = document.createElement("img");
    badge.classList.add("badge");
    badge.src = rankBaseUrl + player.rank.medal + ".png";
    playerRankElement.append(badge);

    if (player.rank.stars != 0) {
      let star = document.createElement("img");
      star.classList.add("star");
      star.src = rankBaseUrl + player.rank.stars + ".png";
      playerRankElement.append(star);
    }

    //name
    playerNameElement.textContent = player.ProName;

    //avatar
    playerAvatarElement.src = player.avatar;
  }
});
socket.on("currentDraft", (e) => {
  catchUpDraft(e);
});

function time(num) {
  let minutes = Math.floor(num / 60);
  let seconds = num % 60;
  if (seconds < 10) return minutes + ":0" + seconds;
  else return minutes + ":" + seconds;
}

function changeSelection() {
  var arrayToDelete = document.getElementsByClassName("selected");
  for (var i = 0; i < arrayToDelete.length; i++) {
    //arrayToDelete[i].classList.remove("selected");
  }

  let id;
  if (activeTeam == "radiant") {
    if (pick) {
      if (radiantPickNum > 4) return;
      id = "radiantpick" + radiantPickNum;
    } else {
      if (radiantBanNum > 6) return;
      id = "radiantban" + radiantBanNum;
    }
  }
  if (activeTeam == "dire") {
    if (pick) {
      if (direPickNum > 4) return;
      id = "direpick" + direPickNum;
    } else {
      if (direBanNum > 6) return;
      id = "direban" + direBanNum;
    }
  }

  console.log(id);
  //document.getElementById(id).classList.add("selected");
  document.getElementById(id).src =
    "https://media1.giphy.com/media/xTkcEQACH24SMPxIQg/giphy.gif?cid=ecf05e4768oisjgare9bkbqdbd4hu6eyvs4xatddll0yvlhh&rid=giphy.gif";
}

function catchUpDraft(currentDraft) {
  console.log(currentDraft);
  document.getElementById("radiant_bonus_time").textContent = time(
    currentDraft.radiant_bonus_time
  );
  document.getElementById("dire_bonus_time").textContent = time(
    currentDraft.dire_bonus_time
  );
  document.getElementById("draft_clock").textContent = time(
    currentDraft.activeteam_time_remaining
  );
  setPickBans(currentDraft.team2, "radiant");
  setPickBans(currentDraft.team3, "dire");
  function setPickBans(team, side) {
    for (const e in team) {
      if (e.startsWith("pick") && e.endsWith("class") && team[e] != "") {
        document.getElementById(side + "pick" + e[4]).src =
          cdn + team[e] + cdn_end;
      }
      if (e.startsWith("ban") && e.endsWith("class") && team[e] != "") {
        document.getElementById(side + "ban" + e[3]).src =
          cdn + team[e] + cdn_end;
      }
    }
  }
}

//the socket connection is established and now all other js files can listen in.
const socket = io();
window.addEventListener("load", main);

function main() {
  draft_addEvents();
}

socket.on("playerRanks", (e) => {
  // ProName: '',
  // PubName: '',
  // avatar: 'https://',
  // rank: { medal: 'Ancient', stars: 4 },
  // leaderboard:
  console.log(e);
  const rankBaseUrl = "./img/medals/";
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
  console.log('here!-------------------------------------')
  catchUpDraft(e);
});

// function changeSelection() {
//   var arrayToDelete = document.getElementsByClassName("selected");
//   for (var i = 0; i < arrayToDelete.length; i++) {
//     //arrayToDelete[i].classList.remove("selected");
//   }

//   let id;
//   if (activeTeam == "radiant") {
//     if (pick) {
//       if (radiantPickNum > 4) return;
//       id = "radiantpick" + radiantPickNum;
//     } else {
//       if (radiantBanNum > 6) return;
//       id = "radiantban" + radiantBanNum;
//     }
//   }
//   if (activeTeam == "dire") {
//     if (pick) {
//       if (direPickNum > 4) return;
//       id = "direpick" + direPickNum;
//     } else {
//       if (direBanNum > 6) return;
//       id = "direban" + direBanNum;
//     }
//   }

//   console.log(id);
//   //document.getElementById(id).classList.add("selected");
//   document.getElementById(id).src = "./img/waiting.webp";
// }

// function catchUpDraft(currentDraft) {
//   // console.log(currentDraft);
//   debugger;
//   console.log("IM HERE--------------------------------------------------")
//   document.getElementById("radiant_bonus_time").textContent = time(
//     currentDraft.radiant_bonus_time
//   );
//   document.getElementById("dire_bonus_time").textContent = time(
//     currentDraft.dire_bonus_time
//   );
//   document.getElementById("draft_clock").textContent = time(
//     currentDraft.activeteam_time_remaining
//   );
//   setPickBans(currentDraft.team2, "radiant");
//   setPickBans(currentDraft.team3, "dire");
//   function setPickBans(team, side) {
//     for (const e in team) {
//       debugger;
//       if (e.startsWith("pick") && e.endsWith("class") && team[e] != "") {
//         document.getElementById(side + "pick" + e[4]).src =
//           cdn + team[e] + cdn_end;

//         document.getElementById(side + "pick" + e[4]).style.backgroundImage =
//           "url('"+cdn + team[e] + cdn_end+"')";
//       }
//       if (e.startsWith("ban") && e.endsWith("class") && team[e] != "") {
//         document.getElementById(side + "ban" + e[3]).src =
//           cdn + team[e] + cdn_end;
//       }
//     }
//   }
// }

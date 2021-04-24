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

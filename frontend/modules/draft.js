function draft_addEvents() {
  socket.on("pick", (e) => {
    console.log(e);
    if (e.value)
      document.getElementById(e.team + "pick" + e.num).src = getHeroImageUrl(
        e.value
      );
    else
      document.getElementById(e.team + "pick" + e.num).src = "./img/empty.png";
  });
  socket.on("ban", (e) => {
    console.log(e);
    if (e.value)
      document.getElementById(e.team + "ban" + e.num).src = getHeroImageUrl(
        e.value
      );
    else
      document.getElementById(e.team + "ban" + e.num).src = "./img/empty.png";
  });
  socket.on("activeteam_time_remaining", (e) => {
    //console.log(e);
    document.getElementById("draft_clock").textContent = time(e);
  });

  socket.on("activeteam", (e) => {
    if (e == 2) activeTeam = "radiant";
    else activeTeam = "dire";
    console.log(activeTeam);
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
  socket.on("selection", (e) => {
    let id =
      (e.team == 2 ? "radiant" : "dire") + (e.pick ? "pick" : "ban") + e.num;
    document.getElementById(id).src = "./img/waiting.webp";
  });
}

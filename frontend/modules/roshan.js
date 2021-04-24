var aegisHolder = -1;
function rosh_addEvents() {
  socket.on("roshTimer", (e) => {
    console.log("roshTimer:" + e);
    //if ((e - 180) > 0) {
    //    document.getElementById("respawntimer").textContent = time((e - 180));
    //}
    //else {
    if (e > 0) document.getElementById("respawntimer").textContent = time(e);
    else document.getElementById("respawntimer").textContent = "";
    //}
  });

  socket.on("aegisHeld", (e) => {
    console.log("aegisHeld: " + e);
    if (aegisHolder == -1 && e != -1) {
      var container = document
        .getElementById("player" + e)
        .getElementsByClassName("item-container")[0];
      var roshIcon = document.createElement("img");
      roshIcon.src =
        "http://cdn.dota2.com/apps/dota2/images/items/aegis_lg.png";
      roshIcon.classList.add("roshIcon");
      container.append(roshIcon);
      aegisHolder = e;
    }
    if (aegisHolder != -1 && e == -1) {
      var container = document
        .getElementById("player" + aegisHolder)
        .getElementsByClassName("item-container")[0];
      for (const element of container.children) {
        if (element.classList.contains("roshIcon")) {
          container.remove(element);
        }
      }
      aegisHolder = -1;
    }
  });
}

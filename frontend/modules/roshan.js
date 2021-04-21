function rosh_addEvents() {
    socket.on("roshTimer", (e) => {
        //if ((e - 180) > 0) {
        //    document.getElementById("respawntimer").textContent = time((e - 180));
        //}
        //else {
            if (e > 0) document.getElementById("respawntimer").textContent = time(e);
            else document.getElementById("respawntimer").textContent = '';
        //}
    });
}
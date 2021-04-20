class DraftEvents {
  constructor(handler) {
    this.handler = handler;

    this.setEvents(handler);
  }

  setEvents(handler) {
    handler.addEvent("draft:activeteam", "activeteam", (e) => {
      handler.draft.activeteam = e;
      return e;
    });

    handler.addEvent(
      "draft:activeteam_time_remaining",
      "activeteam_time_remaining",
      (e) => {
        return e;
      }
    );

    handler.addEvent("draft:dire_bonus_time", "dire_bonus_time", (e) => {
      return e;
    });

    handler.addEvent("draft:radiant_bonus_time", "radiant_bonus_time", (e) => {
      return e;
    });
    handler.addEvent("draft:pick", "pick/ban", (e) => {
      handler.draft.pick = e;
      return e;
    });

    //Event Listeners for hero picks and bans\
    for (var team = 2; team <= 3; team++) {
      //team2 == radiant, team3 == dire
      for (var pick = 0; pick < 5; pick++) {
        //picks 0-4, 5 total
        let eventType = "draft:team" + team + ":pick" + pick + "_class";
        if (team == 2)
          //radiant
          handler.addEvent(
            eventType,
            "pick",
            (function (e) {
              var num = pick;
              let handle = handler;
              let selection = (h) => {
                getNextSelection(h);
              };
              return function (e) {
                handle.draft.radiant.picks[num] = e;
                selection(handle);
                return { team: "radiant", value: e, num: num };
              };
            })()
          );

        if (team == 3)
          //dire
          handler.addEvent(
            eventType,
            "pick",
            (function (e) {
              var num = pick;
              let handle = handler;
              let selection = (h) => {
                getNextSelection(h);
              };
              return function (e) {
                handle.draft.dire.picks[num] = e;
                selection(handle);
                return { team: "dire", value: e, num: num };
              };
            })()
          );
      }
      for (var ban = 0; ban < 7; ban++) {
        //bans 0-6, 7 total
        let eventType = "draft:team" + team + ":ban" + ban + "_class";
        if (team == 2)
          handler.addEvent(
            eventType,
            "ban",
            (function (e) {
              var num = ban;
              let handle = handler;
              let selection = (h) => {
                getNextSelection(h);
              };
              return function (e) {
                handle.draft.radiant.bans[num] = e;
                selection(handle);
                return { team: "radiant", value: e, num: num };
              };
            })()
          );
        if (team == 3)
          handler.addEvent(
            eventType,
            "ban",
            (function (e) {
              var num = ban;
              let handle = handler;
              let selection = (h) => {
                getNextSelection(h);
              };
              return function (e) {
                handle.draft.dire.bans[num] = e;
                selection(handle);
                return { team: "dire", value: e, num: num };
              };
            })()
          );
      }
    }
    var getNextSelection = (handler) => {
      handler.send("selection", this.getNextSelectionObject(handler));
    };
  }

  getNextSelectionObject(handler) {
    const team = handler.draft.activeteam;
    const pick = handler.draft.pick;
    let side = team == 2 ? "radiant" : "dire";
    let pickban = pick ? "picks" : "bans";

    console.log(JSON.stringify(handler.draft));
    let num = handler.draft[side][pickban].findIndex((e) => {
      return !e;
    });
    //if it can't find an empty index in the draft array, return the "next available slot"
    if (num == -1) num = handler.draft[side][pickban].length;

    return {
      team: team,
      pick: pick,
      num: num,
    };
  }
}
module.exports = DraftEvents;

class GsiHandler {
  /**
   * Middle man object that transfers events from dota to the website frontend
   * @param {*} input DotaGSI Client
   * @param {*} output Website Socket
   */
  constructor(input, output) {
    this.input = input;
    this.output = output;
    this.draft = {
      radiant: {
        picks: [],
        bans: [],
      },
      dire: {
        picks: [],
        bans: [],
      },
      activeteam: 0,
      pick: false,
    };
    this.onInit(input);
  }

  /**
   * Sends an event to the frontend.
   * @param {String} eventName
   * @param {Object} data
   */
  send(eventName, data) {
    console.log("sending " + eventName + ": " + JSON.stringify(data));
    this.output.emit(eventName, data);
  }

  /**
   * Takes an event, runs a function on it, and then passes it on to the front-end
   * @param {*} eventName event to listen to
   * @param {*} outputName event name that gets sent out
   * @param {*} codeToExecute function whose results get sent
   */
  addEvent(eventName, outputName, codeToExecute) {
    this.input.on(eventName, (e) => {
      var data = codeToExecute(e);
      if (!outputName.endsWith("time_remaining"))
        console.log("sending " + outputName + ": " + JSON.stringify(data));
      this.output.emit(outputName, data);
    });
  }

  /**
   * A function to handle late connections and can catch up to a game that's already in progress
   * @param {Object} input dotaGSI client
   */
  onInit(input) {
    console.log(input.gamestate.draft);
    //Catch up mid draft
    var draft = input.gamestate.draft;
    this.draft.activeteam = draft.activeteam;
    this.draft.pick = draft.pick;
    for (const property in draft.team2) {
      if (property.endsWith("class")) {
        if (property.startsWith("pick"))
          this.draft.radiant.picks.push(draft.team2[property]);
        else if (property.startsWith("ban"))
          this.draft.radiant.bans.push(draft.team2[property]);
      }
    }
    for (const property in draft.team3) {
      if (property.endsWith("class")) {
        if (property.startsWith("pick"))
          this.draft.dire.picks.push(draft.team2[property]);
        else if (property.startsWith("ban"))
          this.draft.dire.bans.push(draft.team2[property]);
      }
    }
    this.send("activeteam_time_remaining", draft.activeteam_time_remaining);
    this.send("radiant_bonus_time", draft.radiant_bonus_time);
    this.send("dire_bonus_time", draft.dire_bonus_time);

    let i = 0;
    for (const pick of this.draft.radiant.picks) {
      this.send("pick", { team: "radiant", value: pick, num: i++ });
    }
    i = 0;
    for (const ban of this.draft.radiant.bans) {
      this.send("ban", { team: "radiant", value: ban, num: i++ });
    }
    i = 0;
    for (const pick of this.draft.dire.picks) {
      this.send("pick", { team: "dire", value: pick, num: i++ });
    }
    i = 0;
    for (const ban of this.draft.dire.bans) {
      this.send("ban", { team: "dire", value: ban, num: i++ });
    }

    //console.log(input.gamestate.previously);
    //input has the following{ip,auth,gamestate}
    //add stuff here to do when receiving a new game client. Pull info from the gamestate to bring the stats up to date?
  }
}
module.exports = GsiHandler;

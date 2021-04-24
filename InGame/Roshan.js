const GsiHandler = require("../my_modules/main");
const fs = require('fs')
class RoshanEvents {

    constructor(handler) {
        this.handler = handler;
        this.setEvents(handler);
    }

    setEvents(handler) {
        handler.addEvent("map:roshan_state_end_seconds", "roshTimer", (e) => {
            if (this.handler.input.gamestate.map.game_state != "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS") {
                console.log("Game not in progress, gamestate = " + this.handler.input.gamestate.map.gamestate)
                e = 0;
            }
            return e;
        });

        //checks for aegis in inventory
        handler.addEvent("map:roshan_state_end_seconds", "aegisHeld", (e) => {
            //makes sure rosh is in right phase to even allow for aegis (cant have aegis while rosh is alive or in variable respawn)
            if (this.handler.input.gamestate.map.roshan_state == "respawn_base") {
                //checks to make sure aegis timer isnt expired
                if ((this.handler.input.gamestate.map.roshan_state_end_seconds - 180) > 0) {
                    //for each player
                    for (var i = 0; i < 10; i++) {
                        //save the player id for next loop
                        var playerID = i;
                        //for each item slot (this includes backpack which aegis cant go in but easy to copy paste for other items)
                        for (var j = 0; j < 9; j++) {
                            //set the teamid to dire
                            var teamid = 3;
                            //if the player is on radiant, set teamid to radiant
                            if (playerID < 5) teamid = 2;
                            //this will get us hero name
                            let hero = "this.handler.input.gamestate.hero.team" + teamid + ".player" + playerID + ".name";
                            //this is grabbing the value of each item's name
                            let aegischeck = "this.handler.input.gamestate.items.team" + teamid + ".player" + playerID + ".slot" + j + ".name";
                            //if the items name is aegis
                            if (eval(aegischeck) == "item_aegis") {
                                e = playerID;
                                return e;
                            }
                        }
                    }
                }          
            }
            console.log("Aegis impossible or not found");
            e = -1;
            return e;
        });
        handler.addEvent("map:game_state", "roshTimer", (e) => {
            if (this.handler.input.gamestate.map.game_state != "DOTA_GAMERULES_STATE_GAME_IN_PROGRESS") {
                e = 0;
                return e;
            }
        });
    }
}
module.exports = RoshanEvents;


class RoshanEvents {

    constructor(handler) {
        this.handler = handler;
        this.setEvents(handler);
    }

    setEvents(handler) {

        //handler.addEvent("map:roshan_state", "roshState", (RoshState) => {
        //    console.log("logging e: " + RoshState);
        //    return RoshState;
        //});
        handler.addEvent("map:roshan_state_end_seconds", "roshTimer", (e) => {
            return e;      
        })

        /* TODO: Aegis timer
         * Item icons
         */


    }
    
     //fs = require('fs');d
     //respawnTime;

     //   RoshCheck(RoshState)
     //   {
     //       console.log("Rosh Check Called");
     //           //base respawn time (8 minutes)
     //       if (RoshState == "respawn_base") {
     //               console.log("Roshan taken, Respawn in 8-11 minutes");
     //               this.respawnTime = 480
     //           }
     //           //variable respawn (8-11)
     //       else if (RoshState == "respawn_variable") {
     //               this.respawnTime = client.gamestate.map.roshan_state_end_seconds
     //       }
     //   }

//    TimerCountdown() {
//        if (respawnTime > 0) {
//            RoshTimerHandle();
//            respawnTime--;
//        }
//        else {
//            fs.writeFileSync('RoshTimer.txt', '');
//        }
//    }

//   RoshTimerHandle(){
//       var respawnMinutes = Math.floor(respawnTime / 60);
//       var respawnSeconds = (respawnTime % 60);
//       var readableRespawnSeconds = LeadPad(respawnSeconds);
//       var readableTimer = respawnMinutes + ":" + readableRespawnSeconds;
//       return 
//       fs.writeFileSync('RoshTimer.txt', readableTimer);
//       console.log(readableTimer);
//       }

//       LeadPad(num) {
//           num = num.toString();
//           while (num.length < 2) num = "0" + num;
//           return num;
//       }

////this adds a leading 0 to a number if it is under 10. e.g. if timer is 1 minute and 9 seconds it will return 09
////by default text output would read 10:9.
//        LeadPad(num) {
//            num = num.toString();
//            while (num.length < 2) num = "0" + num;
//            return num;
//    }   
}
module.exports = RoshanEvents;


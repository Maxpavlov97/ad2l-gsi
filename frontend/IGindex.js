//the socket connection is established and now all other js files can listen in.
const socket = io();
window.addEventListener("load", main);

function main() {
    rosh_addEvents();
}

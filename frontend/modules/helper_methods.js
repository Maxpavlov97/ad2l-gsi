/**
 * Turn hero name into image url
 * @param {String} hero
 * @returns CDN link to hero portrait
 */
function getHeroImageUrl(hero) {
  console.log("getting");
  const cdn = "http://cdn.dota2.com/apps/dota2/images/heroes/";
  const cdn_end = "_full.png";
  return cdn + hero + cdn_end;
}

/**
 * converts seconds into minutes:seconds
 * @param {Number} num
 * @returns String: minutes:seconds
 */
function time(num) {
  let minutes = Math.floor(num / 60);
  let seconds = num % 60;
  if (seconds < 10) return minutes + ":0" + seconds;
  else return minutes + ":" + seconds;
}

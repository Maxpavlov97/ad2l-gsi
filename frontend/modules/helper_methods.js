/**
 * Turn hero name into image url
 * @param {String} hero
 * @returns CDN link to hero portrait
 */
function getHeroImageUrl(hero) {
  const cdn = "http://cdn.dota2.com/apps/dota2/images/heroes/";
  const cdn_end = "_lg.png";

  return cdn + hero + cdn_end;
}

function getHeroWEBMAsset(hero) {
  const base = "./heroes/npc_dota_hero_"
  const end = ".webm"
  // console.log('returning ')
  return base + hero + end
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

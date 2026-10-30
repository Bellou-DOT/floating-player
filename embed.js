// Turns a page URL into an embeddable player URL. `parent` is the host serving the page (Twitch requires it).
function toEmbed(input, parent) {
  const url = (input || '').trim();
  let m;
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|shorts\/)|youtu\.be\/)([\w-]{11})/)))
    return `https://www.youtube.com/embed/${m[1]}?autoplay=1`;
  if ((m = url.match(/youtube\.com\/.*[?&]list=([\w-]+)/)))
    return `https://www.youtube.com/embed/videoseries?list=${m[1]}&autoplay=1`;
  if ((m = url.match(/twitch\.tv\/videos\/(\d+)/)))
    return `https://player.twitch.tv/?video=${m[1]}&parent=${parent}&autoplay=true`;
  if ((m = url.match(/(?:clips\.twitch\.tv\/|twitch\.tv\/\w+\/clip\/)([\w-]+)/)))
    return `https://clips.twitch.tv/embed?clip=${m[1]}&parent=${parent}&autoplay=true`;
  if ((m = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/)))
    return `https://player.twitch.tv/?channel=${m[1]}&parent=${parent}&autoplay=true`;
  if (/^https?:\/\//.test(url)) return url;        // any other site: tried as-is
  if (url) return `https://${url}`;
  return '';
}
if (typeof module !== 'undefined') module.exports = { toEmbed };

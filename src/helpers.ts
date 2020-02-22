export function msToTime(
  duration: number,
  precision: "minutes" | "seconds" | "millis" = "millis"
) {
  let milliseconds = Math.floor((duration % 1000) / 10),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60);

  const tmillis = "0".repeat(4 - String(milliseconds).length) + milliseconds;
  const tminutes = minutes < 10 ? "0" + minutes : "" + minutes;
  const tseconds = seconds < 10 ? "0" + seconds : "" + seconds;

  let text = tminutes;

  if (precision === "seconds" || precision === "millis") {
    text += ":" + tseconds;
  }
  if (precision === "millis") {
    text += ":" + tmillis;
  }

  return text;
}

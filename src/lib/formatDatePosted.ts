export default function formatDatePosted(date: string): string {
  const now = new Date(Date.now());
  const target = new Date(date);
  const minutesDiff = (now.getTime() - target.getTime()) / 1000;
  let timeframe = "";
  let diff = "";
  if (minutesDiff < 59) {
    timeframe = "just now";
  } else if (Math.round(minutesDiff / 60) < 60) {
    timeframe = "minutes ago";
    diff = (minutesDiff / 60).toFixed();
  } else if (Math.round(minutesDiff / 60 / 60) < 24) {
    timeframe = "hours ago";
    diff = (minutesDiff / 60 / 60).toFixed();
  } else if (Math.round(minutesDiff / 60 / 60 / 24) < 31) {
    timeframe = "days ago";
    diff = (minutesDiff / 60 / 60 / 24).toFixed();
  } else if (Math.round(minutesDiff / 60 / 60 / 24 / 30) < 12) {
    timeframe = "months ago";
    diff = (minutesDiff / 60 / 60 / 24 / 30).toFixed();
  } else {
    timeframe = "years ago";
    diff = (minutesDiff / 60 / 60 / 24 / 30 / 12).toFixed();
  }
  return `${diff} ${timeframe}`;
}

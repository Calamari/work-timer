function showTime(time) {
  var seconds = time / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var result = [];
  if (hours >= 1) {
    result.push(Math.floor(hours) + 'h');
    minutes -= Math.floor(hours)*60;
  }
  if (minutes >= 1) {
    result.push(Math.floor(minutes) + 'm');
  }
  if (Math.floor(seconds%60) > 0) {
    result.push(Math.floor(seconds%60) + 's');
  }
  return result.join(' ');
}

module.exports = {
  showTime: showTime
};

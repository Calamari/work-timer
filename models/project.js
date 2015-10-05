
var moment = require('moment');

function Project(name) {
  this.name = name;
  this.times = [];
  this.currentStartedTime = null;
  this.additionalTimes = {};
}
Project.prototype.startTimer = function startTimer(time, timerId) {
  this.currentStartedTime = time;
  this.currentStartedTimerId = timerId;
};
Project.prototype.endTimer = function endTimer(time) {
  this.times.push({ id: this.currentStartedTimerId, start: this.currentStartedTime, end: time, total: time - this.currentStartedTime });
  this.currentStartedTime = null;
  this.currentStartedTimerId = null;
};
Project.prototype.addTimeToDay = function addTimeToDay(date, seconds) {
  var dateStr = moment(date).format('DD.MM.YYYY');
  if (!this.additionalTimes[dateStr]) {
    this.additionalTimes[dateStr] = 0;
  }
  this.additionalTimes[dateStr] += seconds;
};
Project.prototype.timeInProject = function timeInProject() {
  var totalTime = 0,
      additionalTimes = this.additionalTimes;
  this.times.forEach(function(time) {
    totalTime += time.total;
  });
  Object.keys(additionalTimes).forEach(function(timeKey) {
    totalTime += additionalTimes[timeKey];
  });
  return totalTime;
};
Project.prototype.timesOfProject = function timesOfProject() {
  return this.times;
};
Project.prototype.aggregatedTimesOfProject = function aggregatedTimesOfProject(aggregate) {
  var result = {};
  var aggregates = {
    days: function(date) {
      return moment(date).format('DD.MM.YYYY');
    },
    weeks: function(date) {
      date = moment(date);
      return date.isoWeek() + '.' + date.year();
    },
  };
  this.times.forEach(function(time) {
    var day = aggregates[aggregate](time.start);
    if (!result[day]) {
      result[day] = 0;
    }
    result[day] += time.end - time.start;
    if (this.additionalTimes[day]) {
      result[day] += this.additionalTimes[day];
    }
  }.bind(this));
  return result;
};

module.exports = Project;

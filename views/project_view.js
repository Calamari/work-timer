
var moment = require('moment');

function TimeTrack(id, start) {
  this.id = id;
  this.start = moment(start);
}
TimeTrack.prototype.end = function(end) {
  this.end = moment(end);
}
TimeTrack.prototype.year = function() {
  return this.start.year();
}
TimeTrack.prototype.month = function() {
  return this.start.month();
}
TimeTrack.prototype.day = function() {
  return this.start.day();
}
TimeTrack.prototype.format = function() {
  return this.start.format('DD.MM.YYYY');
}
TimeTrack.prototype.time = function() {
  return this.end - this.start;
}
TimeTrack.prototype.week = function() {
  return this.start.isoWeek() + '.' + this.start.year();
};

function TrackingStore() {
  this.store = {};
  this._weekStore = {};
  this.items = [];
  this.aggregatedTime = 0;
}
TrackingStore.prototype.storeTracking = function(keys, timeTrack) {
  if (arguments.length === 0) {
    return this.store();
  }
  if (keys.length) {
    var key = keys.shift();
    if (!this.store[key]) {
      this.store[key] = new TrackingStore();
    }
    this.store[key].storeTracking(keys, timeTrack);
  } else {
    this.items.push(timeTrack);
  }
  this.aggregatedTime += timeTrack.time();
}
TrackingStore.prototype.addTime = function(keys, timeInSeconds) {
  if (keys.length) {
    var key = keys.shift();
    this.store[key].addTime(keys, timeTrack);
  }
  this.aggregatedTime += timeInSeconds;
}
TrackingStore.prototype.getTracking = function(depth) {
  var self = this;
  console.log(this);
  console.log(Object.values(this.store));
  return Object.values(this.store).map(function(trackings) {
    console.log("T", trackings);
    if (--depth) {
      return self.getTracking(depth).flatten();
    } else {
      return trackings;
    }
  });
}

function Project(id) {
  this.id = id;

  this.trackings = new TrackingStore();

  this.currentTracking = null;
}
Project.prototype._storeTracking = function(timeTrack) {
  this.trackings.storeTracking([timeTrack.year(), timeTrack.month(), timeTrack.week(), timeTrack.day()], timeTrack);
}
Project.prototype.endTracking = function(endTime) {
  this.currentTracking.end(endTime);
  this._storeTracking(this.currentTracking);
  this.currentTracking = null;
}
Project.prototype.startTracking = function(id, startTime) {
  this.currentTracking = new TimeTrack(id, startTime);
}
Project.prototype.addTimeToDay = function(day, timeInSeconds) {
  this.trackings.addTime([day.year(), day.month(), day.day()], timeInSeconds);
}
Project.prototype.weeks = function() {
  console.log("PPP", this);
  return this.trackings.getTracking(3);
}


var ProjectView = {
  projects: {},
  addProject: function(id, name) {
    this.projects[name] = new Project(id, name);
  },
  getProject: function(name) {
    return this.projects[name];
  },

  handle: function(event) {
    if (ProjectView.eventHandlers[event.name]) {
      ProjectView.eventHandlers[event.name](event);
    }
  },
  eventHandlers: {
    createProject: function(event) {
      ProjectView.addProject(event.aggregateId, event.data.name);
    },
    startTimeTracking: function(event) {
      var project = ProjectView.getProject(event.data.project);
      project.startTracking(event.aggregateId, new Date(event.data.startTime));
    },
    endTimeTracking: function(event) {
      var project = ProjectView.getProject(event.data.project);
      project.endTracking(new Date(event.data.endTime));
    },
    addTimeToDay: function(event) {
      var project = ProjectView.getProject(event.data.project);
      project.addTimeToDay(new Date(event.data.date), event.data.time);
    }
  }
};

module.exports = ProjectView;


var Project = require('./project');

var Projects = {
  projects: {},
  handle: function(event) {
    if (Projects.eventHandlers[event.name]) {
      Projects.eventHandlers[event.name](event);
    }
  },
  eventHandlers: {
    createProject: function(event) {
      Projects.projects[event.data.name] = new Project(event.data.name);
    },
    startTimeTracking: function(event) {
      Projects.projects[event.data.project].startTimer(new Date(event.data.startTime), event.aggregateId);
    },
    endTimeTracking: function(event) {
      Projects.projects[event.data.project].endTimer(new Date(event.data.endTime));
    },
    addTimeToDay: function(event) {
      Projects.projects[event.data.project].addTimeToDay(new Date(event.data.date), event.data.time);
    }
  },

  all: function() {
    var projects = [];
    Object.keys(Projects.projects).forEach(function(name) {
      projects.push(Projects.projects[name]);
    });
    return projects;
  },

  get: function(name) {
    return Projects.projects[name];
  },

  doesProjectExist: function(name) {
    return !!Projects.projects[name];
  },

  timeInProject: function(projectName) {
    return Projects.projects[projectName].timeInProject();
  },

  timesOfProject: function(projectName) {
    return Projects.projects[projectName].timesOfProject();
  }
};

module.exports = Projects;

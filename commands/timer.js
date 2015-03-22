var DomainEvent = require('event-sourcer.js').DomainEvent,
    uuid        = require('node-uuid'),
    moment      = require('moment'),

    Projects = require('../models/projects'),
    Timer    = require('../models/timer');

module.exports = {
  startTime: function startTime(data) {
    var errors = [];
    return {
      isValid: function() {
        if (!data.project) {
          errors.push('Project name has to be specified.');
        }
        if (Timer.isStarted()) {
          errors.push('Timing is already in progress. Cannot start another one.');
        }
        return !errors.length;
      },
      errors: function() { return errors; },
      run: function() {
        var events = [];
        if (!Projects.doesProjectExist(data.project)) {
          events.push(new DomainEvent('createProject', uuid.v1(), {
            name: data.project
          }));
        }
        events.push(new DomainEvent('startTimeTracking', uuid.v1(), {
          project: data.project,
          startTime: new Date().toUTCString()
        }));
        return events;
      }
    };
  },
  endTime: function startTime(data) {
    var errors = [];
    return {
      isValid: function() {
        if (!data.project) {
          errors.push('Project name has to be specified.');
          return false;
        }
        if (!Timer.isStarted()) {
          errors.push('No timing in progress.');
          return false;
        }
        if (!Timer.isTiming(data.project)) {
          errors.push('No timing for project "' + data.project + '" in progress.');
          return false;
        }
        return !errors.length;
      },
      errors: function() { return errors; },
      run: function() {
        return [new DomainEvent('endTimeTracking', Timer.getStartedUuid(), {
          project: data.project,
          endTime: new Date().toUTCString()
        })];
      }
    };
  },
  switchProject: function switchProject(data) {
    var errors = [];
    return {
      isValid: function() {
        if (!data.project) {
          errors.push('Project name has to be specified.');
        }
        if (!Timer.isStarted()) {
          errors.push('No timing in progress.');
          return false;
        }
        return !errors.length;
      },
      errors: function() { return errors; },
      run: function() {
        var events = [];
        events.push(new DomainEvent('endTimeTracking', Timer.getStartedUuid(), {
          project: Timer.actualTimingProjectName(),
          endTime: new Date().toUTCString()
        }));
        events.push(new DomainEvent('startTimeTracking', uuid.v1(), {
          project: data.project,
          startTime: new Date().toUTCString()
        }));
        return events;
      }
    };
  },
  addTimeToDay: function addTimeToDay(data) {
    var errors = [],
        day    = new Date(Date.parse(data.date));

    return {
      isValid: function() {
        if (!data.project) {
          errors.push('Project name has to be specified.');
        }
        if (!day) {
          errors.push('The date has to be given in Format dd.mm.YYYY.');
        }
        if (!data.time || typeof data.time !== 'number') {
          errors.push('The time has to be given in seconds.');
        }
        return !errors.length;
      },
      errors: function() { return errors; },
      run: function() {
        var events = [];
        events.push(new DomainEvent('addTimeToDay', uuid.v1(), {
          project: data.project,
          date: day.toUTCString(),
          time: data.time
        }));
        return events;
      }
    };
  }
};

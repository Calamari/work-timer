
var Timer = {
  handle: function(event) {
    if (Timer.eventHandlers[event.name]) {
      Timer.eventHandlers[event.name](event);
    }
  },
  eventHandlers: {
    startTimeTracking: function(event) {
      Timer._actualTimingProjectName = event.data.project;
      Timer._actualTimingUuid = event.aggregateId;
    },
    endTimeTracking: function(event) {
      Timer._actualTimingProjectName = null;
      Timer._actualTimingUuid = null;
    }
  },

  getStartedUuid: function() {
    return Timer._actualTimingUuid;
  },

  isStarted: function() {
    return !!Timer._actualTimingProjectName;
  },

  actualTimingProjectName: function() {
    return Timer._actualTimingProjectName;
  },

  isTiming: function(projectName) {
    return Timer._actualTimingProjectName === projectName;
  }
};

module.exports = Timer;

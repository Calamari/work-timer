
function Project(id) {
  this.id = id;
}

var ProjectView = {
  handle: function(event) {
    if (ProjectView.eventHandlers[event.name]) {
      ProjectView.eventHandlers[event.name](event);
    }
  },
  eventHandlers: {
  }
};

module.exports = ProjectView;

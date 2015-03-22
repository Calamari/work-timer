/**
TODOs:
 - Process übergreifender event distributor (Redis? AMQP?)

**/

var Hapi = require('hapi');

var Projects = require('../models/projects');
var Timer = require('../models/timer');
var helpers = require('../helpers');

require('handlebars').registerHelper('showTime', function(time) {
  return helpers.showTime(time);
});

function init(app, config) {
  config = config || {};

  var server = new Hapi.Server();
  server.connection({
    port: config.port || 8181
  });

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layouts',
    // helpersPath: './views/helpers'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function(req, res) {
      res.view('index', {
        projects: Projects.all(),
        anyTimerStarted: Timer.isStarted(),
        title: 'Work TIMER'
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/start-timer/{project}',
    handler: function(req, res) {
      app.runCommand('startTime', { project: req.params.project }, function(err) {
        res.redirect('/');
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/end-timer/{project}',
    handler: function(req, res) {
      app.runCommand('endTime', { project: req.params.project }, function(err) {
        res.redirect('/');
      });
    }
  });
  server.route({
    method: 'GET',
    path: '/projects/{projectName}',
    handler: function(req, res) {
      var project = Projects.get(req.params.projectName);
      res.view('projects', {
        project: project,
        times: project.timesOfProject(),
        days: project.aggregatedTimesOfProject('days'),
        weeks: project.aggregatedTimesOfProject('weeks')
      });
    }
  });

  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = init;

/**
TODOs:
 - Process übergreifender event distributor (Redis? AMQP?)

**/

var Hapi = require('hapi');
var path = require('path');

var Projects = require('../models/projects');
var Timer = require('../models/timer');
var helpers = require('../helpers');
var ProjectView = require('../views/project_view');

require('handlebars').registerHelper('showTime', function(time) {
  return helpers.showTime(time);
});

function init(app, config) {
  config = config || {};

  var server = new Hapi.Server({
    connections: {
      routes: {
        files: {
          relativeTo: path.join(__dirname, 'public')
        }
      }
    }
  });
  server.connection({
    port: config.port || 8181
  });

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: './views',
    layout: true,
    layoutPath: './views/layouts',
    layoutKeyword: 'body'
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
      console.log("CALL", ProjectView.getProject(req.params.projectName));
      var project = Projects.get(req.params.projectName);
      console.log( ProjectView.getProject(req.params.projectName).trackings.store['2015']);
      console.log(project.times);
      res.view('projects', {
        breadcrumb: project.name,
        project: ProjectView.getProject(req.params.projectName),
        // project: project,
        times: project.timesOfProject(),
        days: project.aggregatedTimesOfProject('days'),
        weeks: project.aggregatedTimesOfProject('weeks')
      });
    }
  });

  // Serve static assets
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, 'public')
      }
    }
  });

  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = init;

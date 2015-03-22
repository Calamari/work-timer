#!/usr/local/bin/node

// Wie geht man mit concurrency um?
// Application startet, ein event wird verschickt, aber noch nicht angekommen
var ES = require('event-sourcer.js'),
    dbConfig = require('./db_config.json'),

    eventDistributor = new ES.eventDistributors.Redis(redisReady),
    eventStore       = new ES.eventStores.Postgres(dbConfig),

    commands = [
      require(__dirname + '/commands/timer')
    ],

    eventHandlers = [
      require(__dirname + '/models/timer'),
      require(__dirname + '/models/projects'),
      require(__dirname + '/views/project_view')
    ],

    program = require('commander'),
    Projects = require('./models/projects'),
    helpers = require('./helpers'),

    app;

function redisReady() {
  app = new ES.App({
    eventDistributor: eventDistributor,
    eventStore: eventStore,
    eventHandlers: eventHandlers,
    commands: commands,
    afterInit: afterInit
  });
}

// eventDistributor.addHandler(function() {
//   console.log("addHandler", arguments);
// });

function afterInit() {
  // console.log("LP", require('./models/projects').projects);
  // eventStore.all(function(err, events) {
    // console.log("all events", events);
  //   app.runCommand('startTime', { project: 'testproject 1' }, function() {
  //     console.log("Done", arguments);
  //     process.exit();
  //   });
  //   console.log("LP", require('./models/projects').projects);
  program.parse(process.argv);
  // });
}

program
  .command('server')
  .action(function() {
    require('./web-server')(app);
  });

program
  .command('start <project>')
  .action(function(project) {
    app.runCommand('startTime', { project: project }, handleRunResponse);
  });

program
  .command('end <project>')
  .action(function(project) {
    app.runCommand('endTime', { project: project }, function(err) {
      console.log('Project time of ' + project + ':', helpers.showTime(Projects.timeInProject(project)));
      handleRunResponse(err);
    });
  });

program
  .command('switch <project>')
  .action(function(project) {
    app.runCommand('switchProject', { project: project }, handleRunResponse);
  });

program
  .command('add <project> <date> <minutes>')
  .action(function(project, date, minutes) {
    app.runCommand('addTimeToDay', { project: project, date: date, time: parseInt(minutes, 10) * 60 }, handleRunResponse);
  });

program
  .command('total <project>')
  .action(function(project) {
    console.log('List time of ' + project + ':');
    Projects.timesOfProject(project).forEach(function(time) {
      console.log(time.start, '-', time.end, ':', helpers.showTime(time.total));
    });
    console.log('Total:', helpers.showTime(Projects.timeInProject(project)));
    handleRunResponse();
  });

function handleRunResponse(err) {
  if (err) {
    console.log("Error happened", err);
  } else {
    console.log("Successfully done …");
  }
  process.exit();
}

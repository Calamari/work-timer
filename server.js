
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

function afterInit() {
  require('./web-server')(app);
}

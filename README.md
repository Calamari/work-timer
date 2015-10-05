# Work Timer

Let me track my work.

## Installation

- `npm install`
- Install PostgreSQL
- Create Database `work_timer_dev`
- Run contents of `node_modules/event-sourcer.js/db-migration/postgres.sql` in `psql` console

## Run

- Terminal commands are to found within `index.js`. Call like this: `./index.js start MyProject1`
- Webfrontend is found in `server.js`. Start server like this: `node server.js`

## Development

We use foundation scss and ruby sass to compile it css.

- Run watching of sass via `bundle exec compass watch`

If node and node-sass would find libsass again, I would use this:

- Run gulp watch tasks `gulp dev`

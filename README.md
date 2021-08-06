# BigBisonChat
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/iannotian/BigBisonChat)

This is the backend for BigBisonChat. Please see the README for the [web client](https://github.com/eyeino/BigBisonChat-React) to learn about the frontend.

## Development

_Prerequisites: Docker 3.x, Docker Compose, npm_
_Recommended: Volta for NPM version management_

This process will build you an app container with hot reloading and a local, seeded Postgres instance.

- Clone this repo.
- Duplicate the example `*.env.example` files and rename them to get plain `*.env` files. You should have `.env` in the root folder, and `db.env` in `docker/db`.
- Run `npm i` and then `docker compose up` in the root folder of this project.
- Access the endpoint at `localhost:8080` or query the database at `localhost:5432`.

### Database changes

Database queries are specified in `.sql` files. `npm run generate:types` will generate types for these queries. Make sure to match the database environment variables in `pgtyped.config.json` with the `db.env` file in `docker/db` so that pgtyped can connect to Postgres.

Migration files are in `src/database/migrations`. Use `npm run migrate:create` to generate a migration file, and `npm run migrate:apply` to run the migration.

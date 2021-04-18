# BigBisonChat

This is the backend for BigBisonChat. Please see the README for the [web client](https://github.com/eyeino/BigBisonChat-React) to learn about the frontend.

## Development

Starting this up is very, very simple. You just need Docker.
This process will build you an app container with hot reloading and a local, seeded Postgres instance.

- Clone this repo.
- Duplicate the example `*.env.example` files and rename them to get plain `*.env` files. You should have `.env` in the root folder, and `db.env` in `docker/db`.
- Run `docker compose up` in the root folder of this project.
- Access the endpoint at `localhost:8080` or query the database at `localhost:5432`.

Check out the frontend, which works in tandem with this.

### Database changes

Database queries are specified in `.sql` files. `npm run generate:types` will generate types for these queries. Make sure to match the database environment variables in `pgtyped.config.json` with the `db.env` file in `docker/db` so that pgtyped can connect to Postgres. To run this command you will need Node.
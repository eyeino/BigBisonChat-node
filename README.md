# BigBisonChat

This is the backend for BigBisonChat. Please see the README for the [React client](https://github.com/eyeino/BigBisonChat-React) to learn about the frontend.

## Development

Starting this up is very, very simple. You just need Node (14+) and Docker.

- Clone this repo.
- Make sure those .env files match up!
- Run `docker compose up` in the root folder of this project.
- This will build you an app container with hot reloading and a local, seeded Postgres instance.
- Check out the frontend, which works in tandem with this.

### Database changes

Database queries are done in .sql files. `npm generate:types` will generate types for these queries.
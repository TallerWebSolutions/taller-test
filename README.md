<p align="center">
  <a href="http://taller.net.br">
    <img src="https://avatars0.githubusercontent.com/u/5984356?v=4&s=200" />
  </a>
</p>

<h1 align="center">
  <a href="http://taller.net.br">Taller</a>'s Chat Test
</h1>

<p align="center">A chat application that intends to beat Slack, but is humble enough to understand this is never going to happen.</p>

## How will it work

Our intent with the test is for us to understand your technical proficiency and your decision make process.

You will install this application, have a look around, and once you have all up-and-running we will schedule a screening code interview, during which you are will be asked to develop a couple of new features or bug fixes inside the project.

## What will you need

This application consists of a [Drupal 8](http://drupal.org/) backend and a [Next.js](https://github.com/zeit/next.js/) based [React](https://reactjs.org/) application. The application consumes Drupal's [GraphQL](https://www.drupal.org/project/graphql) API using [Apollo](https://www.apollographql.com/).

### Requirements

To run it locally, you must have:

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Make

## Install & Run

This project relies on docker to setup the development environment and there are already some scripts available for common tasks on the Makefile at the root. Follow these steps to get started:

**Build the containers** :hammer:

```sh
make run
```

**Grab a coffee** :coffee:

Big one. This takes a while.

> Don't have SSD? Take two coffees.

**See Drupal running** :droplet:

Access http://localhost

> **Credentials**<br />
Username: *admin*<br />
Password: *password*

**Start Next.js application** :fire:

```
cd next
yarn dev
```

**Access http://localhost:3000** :tada:

> We use [yarn](https://yarnpkg.com/pt-BR/) instead of [npm](https://www.npmjs.com/). This is not necessary, but recommended.

## Available commands

### Makefile

Anytime you need, you can use these available Make commands:

| Command | Description |
| - | - |
| `make run` | Executes and enters the container |
| `make in` | Enters the active container |
| `make mysql` | Access [MySQL](https://www.mysql.com/) instance used by Drupal |
| `make stop` | Stops all containers |
| `make clean` | Removes all containers |
| `make build` | Rebuild the app image |

### Next.js

The following commands are available on the Next.js React application:

| Command | Description |
| - | - |
| `yarn dev` | Start the application in development mode |
| `yarn build` | Build the application for production |
| `yarn start` | Start the application in production mode |
| `yarn build:start` | Build and start for production (good for CI) |
| `yarn lint` | Runs [ESLint](https://eslint.org/) on your files |
| `yarn test:unit` | Runs [Jest](https://facebook.github.io/jest/) automated tests |
| `yarn test:unit:watch` | Runs Jest automated tests in watch mode |
| `yarn run:prepush` | Runs all tasks necessary for code-quality assurance |

## What should I do now?

It is important that you have the development environment operational before the interview. So take the time and study how things work on the application, maybe try and stress it to find some errors yourself. If you have any trouble you can open an issue on this repository and we'll get back to you as soon as possible.

## *Disclaimer*

*This project is not a product, will not go into production, and has no intend to serve any purpose other than to be a constrained but near-real-world application used to test candidates to a development position at [Taller](taller.net.br).*

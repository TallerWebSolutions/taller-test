<p align="center">
  <a href="http://taller.net.br">
    <img src="https://avatars0.githubusercontent.com/u/5984356?v=4&s=200" />
  </a>
</p>

<h1 align="center">
  <a href="http://taller.net.br">Taller</a>'s Chat Stack
</h1>

<p align="center">
  <a href="https://www.drupal.org">
    <img height="85" src="https://www.drupal.org/files/druplicon-small.png" />
  </a>

  <a href="http://graphql.org/">
    <img height="95" src="https://avatars.githubusercontent.com/u/13958777?v=3&s=200" />
  </a>

  <a href="https://www.apollographql.com/">
    <img height="100" src="http://www.discovermeteor.com/images/blog/apollo-logo.png" />
  </a>

  <a href="https://reactjs.org/">
    <img height="80" src="https://sandstorm.de/_Resources/Persistent/3285416e8503b2c8354c321bcd690cf550b8b2d3/React-Logo.svg" />
  </a>

  <a href="https://github.com/zeit/next.js/">
    <img height=90 src="https://cloud.githubusercontent.com/assets/13041/19686250/971bf7f8-9ac0-11e6-975c-188defd82df1.png" />
  </a>
</p>

<p align="center">Hipster to the core</p>

## Overview

This application consists of a [Drupal 8](http://drupal.org/) backend providing a [GraphQL](https://www.drupal.org/project/graphql) API which is consumed by [Apollo](https://www.apollographql.com/) on a [Next.js](https://github.com/zeit/next.js/) based [React](https://reactjs.org/) application.

### Drupal 8 <img align="right" height="25" src="https://www.drupal.org/files/druplicon-small.png" />

The Drupal 8 install is a pretty straight forward one:

- It uses [Composer](https://getcomposer.org/) as a dependency manager for both vendor packages and Drupal [modules](https://www.drupal.org/project/project_module);
- Drupal's web root can be found at [_./drupal_](./drupal) directory
- It is using a custom profile, found at [_./drupal/profiles/custom/taller_chat_](./drupal/profiles/custom/taller_chat);
- Custom modules (where any code of yours should most probably reside) at [_./drupal/modules/custom_](./drupal/modules/custom);
- It has modules [graphql](https://www.drupal.org/project/graphql) and [graphql_mutation](https://www.drupal.org/project/graphql_mutation) for exposing the GraphQL API.

The container is configured to download dependencies and install Drupal on the first time you run it, but if you have any trouble with this step please follow the [official installation guide](https://www.drupal.org/docs/8/install).

Drupal will connect to a MySQL database provided within a parallel container which will also be automatically configured for you.

Once the container is running, you can access Drupal's administrative interface on http://localhost, using the following credentials:

Username: **admin**<br />
Password: **password**

### GraphQL <img align="right" height="25" src="https://avatars.githubusercontent.com/u/13958777?v=3&s=200" />

GraphQL is the way of communication between Drupal and the React app. The API is provided by Drupal on the _http://localhost/graphql_ endpoint.

**You can navigate on the available schema using a [GraphiQL](https://github.com/graphql/graphiql/) instance available at _http://localhost/graphql/explorer_.**

If you need to create new fields or even types, you can follow the examples on the available custom Drupal modules.

### Apollo <img align="right" height="25" src="http://www.discovermeteor.com/images/blog/apollo-logo.png" />

Apollo is the GraphQL client used by the React application. It uses the environment variable `GRAPHQL_HOST` to send `POST` requests with GraphQL query bodies for either queries or mutations.

You can customize the client at [_./next/src/lib/initApollo.js_](./next/src/lib/initApollo.js).

### React <img align="right" height="25" src="https://sandstorm.de/_Resources/Persistent/3285416e8503b2c8354c321bcd690cf550b8b2d3/React-Logo.svg" />

Not much to say here. Version _^16.2.0_ is used. Also, here are some used libraries worth mentioning:

- [Recompose](https://github.com/acdlite/recompose);
- [grommet](http://grommet.io) for bootstraped UI;
- [styled-components](https://www.styled-components.com/) for CSS in JS;
- [Ramda](http://ramdajs.com/) for functional programming;
- [react-final-form](https://github.com/final-form/react-final-form) for form management.

### Next.js <img align="right" height="25" src="https://cloud.githubusercontent.com/assets/13041/19686250/971bf7f8-9ac0-11e6-975c-188defd82df1.png" />

Next.js is the React framework used to define routes, split code, and server-side render the application. It's root can be found on the [_./next_](./next) directory.

There is some customization to make _styled-componets_ work, as well as for universal environment variables (refer to the _env-config.js_ file for more information). Other than that, it is quite a clean install.

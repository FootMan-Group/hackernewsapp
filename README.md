## Description

This is a hacker news app

## Installation

```bash
$ npm install
$ npm i -g @nestjs/cli
$ npm i --save @nestjs/axios
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## The end points

```bash
# 10 most occurring words in the titles of the last 25 stories
http://localhost:3000/titlemost25

# 10 most occurring words in the titles of the post of exactly the last week
http://localhost:3000/toplastweek

# 10 most occurring words in titles of the last 600 stories of users with at least
http://localhost:3000/topusers
```

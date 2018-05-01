# Lab 11-12 Express
**Author**: Lacy Hogan
**Version**: 1.0.2

## Overview
This application stores information about penguins. It takes in a species, a first name, a description, and a gender. A species and a first name are required fields. A user can create a new penguin, update an existing one, find an existing one, and delete an existing one.

## Getting Started
As a user, you will need to have MongoDB installed on your computer. 

You will need to include the following scripts in your package.json in order to run the tests and mongod:

 "scripts": {
    "test": "eslint . && jest --coverage --forceExit --runInBand",
    "lint": "eslint .",
    "start": "nodemon main.js",
    "dbon": "mkdir -p ./db && mongod --db path ./db",
    "dboff": "killall mongod"

You will also need to include the following in order to test your environment:

  "jest": {
    "setupFiles": [
      "<rootDir>/src/__test__/lib/test.env.js"
    ]
  },

You will need to init the following dependencies and devDependencies before utilizing this application:

  "devDependencies": {
    "babel-eslint": "^8.2.3",
    "babel-preset-env": "^1.6.1",
    "babel-register": "^6.26.0",
    "eslint": "^4.19.1",
    "eslint-config-airbnb-base": "^12.1.0",
    "eslint-plugin-import": "^2.11.0",
    "eslint-plugin-jest": "^21.15.1",
    "jest": "^22.4.3",
    "nodemon": "^1.17.3",
    "superagent": "^3.8.2"
  },
  "dependencies": {
    "body-parser": "^1.18.2",
    "dotenv": "^5.0.1",
    "express": "^4.16.3",
    "faker": "^4.1.0",
    "http-errors": "^1.6.3",
    "mongoose": "^5.0.16",
    "winston": "^3.0.0-rc5"
  }

## Architecture
This application is written in JavaScript. You will need MongoDB installed and utilize body-parser, express, and mongoose middleware. 

In order to run tests, first start MongoDB (in windows, run the command: net start mongodb) at the root level. Then, in a separate terminal, run the command: npm run test.

In order to test as CLI, un-comment code in main.js. You will need to ensure that you have nodemon and httpie installed on your computer. Then, in one terminal, run the command: nodemon index.js. Then, in a separate terminal, run the commands:

To POST/CREATE - http POST :7000/api/penguins species=[name of species] firstName=[name] description=[""] gender=[male or female]

- If successful, will respond with a 200 status. If an invalid post is made, will respond with a 400 status

To GET/READ - http :7000/api/penguins id==[insert existing id]

- If successful, will respond with a 200 status. If an invalid get is made, will respond with a 404 status

To PUT/UPDATE - http PUT :7000/api/penguins id==[insert existing id] [species/firstName/description/gender]=[""]

- If successful, will respond with a 200 status. If an invalid put is made, will respond with a 404 status

to DELETE - http DELETE :7000/api/penguins id==[insert existing id]

- If successful, will respond with a 204 status. If an invalid post is made, will respond with a 404 status

## Change Log
04-30-2018 8:30pm - Application POST and GET functions created and passing tests.
05-01-2018 9:00am - Application DELETE function create and passing tests.
05-01-2018 4:40pm - Application PUT function created and passing tests.

## Credits and Collaborations
Seth Donohue and Judy Vue
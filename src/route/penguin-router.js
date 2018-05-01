'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Penguin from '../model/penguin';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const penguinRouter = new Router();

penguinRouter.post('/api/penguins', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.species) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new Penguin(request.body).save()
    .then((penguin) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(penguin);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

penguinRouter.get('/api/penguins/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Penguin.findById(request.params.id)
    .then((penguin) => {
      if (!penguin) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!penguin)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(penguin);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

penguinRouter.delete('/api/penguins/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing a request');

  return Penguin.findByIdAndRemove(request.params.id)
    .then((penguin) => {
      if (!penguin) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!penguin)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return response.json(penguin);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__DELETE_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

export default penguinRouter;

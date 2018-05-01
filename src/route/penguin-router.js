'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Penguin from '../model/penguin';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const penguinRouter = new Router();

penguinRouter.post('/api/penguins', jsonParser, (request, response, next) => {
  if (!request.body.species) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'species is required'));
  }
  return new Penguin(request.body).save()
    .then((penguin) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(penguin);
    })
    .catch(next);
});

penguinRouter.put('/api/penguins/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  
  return Penguin.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPenguin) => {
      if (!updatedPenguin) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code - (!penguin)');
        return next(new HttpErrors(404, 'penguin not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedPenguin);
    })
    .catch(next);
});

penguinRouter.get('/api/penguins/:id', (request, response, next) => {
  return Penguin.findById(request.params.id)
    .then((penguin) => {
      if (!penguin) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!penguin)');
        return next(new HttpErrors(404, 'penguin not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(penguin);
    })
    .catch(next);
});

penguinRouter.delete('/api/penguins/:id', (request, response, next) => {
  return Penguin.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return next(new HttpErrors(204, 'Penguin deleted'));
    })
    .catch(next);
});

export default penguinRouter;

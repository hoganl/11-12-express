'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Penguin from '../model/penguin';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/penguins`;

const createPenguinMock = () => {
  return new Penguin({
    species: faker.lorem.word(2),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    gender: faker.lorem.word(1),
  }).save();
};

describe('/api/penguins', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Penguin.remove({}));
  test('POST - Should respond with 200 status', () => {
    const penguinToPost = {
      species: faker.lorem.word(2),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: faker.lorem.word(1),
    };
    return superagent.post(apiURL)
      .send(penguinToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.species).toEqual(penguinToPost.species);        
        expect(response.body.firstName).toEqual(penguinToPost.firstName);
        expect(response.body.lastName).toEqual(penguinToPost.lastName);
        expect(response.body.gender).toEqual(penguinToPost.gender);
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - should respond with 400 status', () => {
    const penguinToPost = {
      firstName: faker.name.firstName(),
    };
    return superagent.post(apiURL)
      .send(penguinToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/penguins', () => {
    test('should respond with 200 if there are no errors', () => {
      let penguinToTest = null;
      return createPenguinMock()
        .then((penguin) => {
          penguinToTest = penguin;
          return superagent.get(`${apiURL}/${penguin._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.species).toEqual(penguinToTest.species);        
          expect(response.body.firstName).toEqual(penguinToTest.firstName);
          expect(response.body.lastName).toEqual(penguinToTest.lastName);
          expect(response.body.gender).toEqual(penguinToTest.gender);
        });
    });
    test('should respond with 404 if there is no penguin to be found', () => {
      return superagent.get(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/penguins', () => {
    test('should respond with 204 if there are no errors', () => {
      return createPenguinMock()
        .then((penguin) => {
          return superagent.delete(`${apiURL}/${penguin._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if there is no penguin to be found', () => {
      return superagent.delete(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

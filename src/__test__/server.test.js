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
    description: faker.lorem.words(15),
    gender: faker.lorem.word(1),
  }).save();
};

const createManyPenguinMocks = (howManyPenguins) => {
  return Promise.all(new Array(howManyPenguins)
    .fill(0)
    .map(() => createPenguinMock()));
};

describe('/api/penguins', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Penguin.remove({}));
  test('POST - Should respond with 200 status', () => {
    const penguinToPost = {
      species: faker.lorem.word(2),
      firstName: faker.name.firstName(),
      description: faker.lorem.words(20),
      gender: faker.lorem.word(1),
    };
    return superagent.post(apiURL)
      .send(penguinToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.species).toEqual(penguinToPost.species);        
        expect(response.body.firstName).toEqual(penguinToPost.firstName);
        expect(response.body.description).toEqual(penguinToPost.description);
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
    test('should respond with 200 if there are no errors to retrieve one', () => {
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
          expect(response.body.description).toEqual(penguinToTest.description);
          expect(response.body.gender).toEqual(penguinToTest.gender);
        });
    });
    test('should respond with 200 if there are no errors to retrieve all', () => {
      const penguinsLength = 5;
      return createManyPenguinMocks(penguinsLength)
        .then(() => {
          return superagent.get(`${apiURL}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200); 
          const responseLength = JSON.parse(response.text).length;
          expect(responseLength).toEqual(5);
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
  
  describe('PUT /api/notes', () => {
    test('should update a penguin and return a 200 status code', () => {
      let penguinToUpdate = null;
      return createPenguinMock()
        .then((penguinMock) => {
          penguinToUpdate = penguinMock;
          return superagent.put(`${apiURL}/${penguinMock._id}`)
            .send({ species: 'Royal' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.species).toEqual('Royal');
          expect(response.body.firstName).toEqual(penguinToUpdate.firstName);
          expect(response.body.description).toEqual(penguinToUpdate.description);
          expect(response.body.gender).toEqual(penguinToUpdate.gender);
          expect(response.body._id).toEqual(penguinToUpdate._id.toString());
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

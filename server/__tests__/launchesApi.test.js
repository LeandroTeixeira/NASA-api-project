/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../src/app');
const { mongoConnect, mongoDisconnect } = require('../src/services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      target: 'Kepler-1652 b',
      launchDate: 'January 4, 2028',
    };
    const launchDataInvalidPlanet = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      target: 'Kepler-186 f',
      launchDate: 'January 4, 2028',
    };
    const launchDataWithoutDate = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      target: 'Kepler-1652 b',
    };

    const launchDataInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-186 f',
      launchDate: 'USS Enterprise',
    };

    const launchDataPastDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-186 f',
      launchDate: 'January 4, 2020',
    };

    const launchDataWithoutMission = {
      rocket: 'NCC 1701-D',
      target: 'Kepler-186 f',
      launchDate: 'January 4, 2028',
    };

    const launchDataWithoutRocket = {
      mission: 'USS Enterprise',
      target: 'Kepler-186 f',
      launchDate: 'January 4, 2028',
    };
    const launchDataWithoutTarget = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      launchDate: 'January 4, 2028',
    };

    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .post('/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test('It should catch missing data', async () => {
      await request(app)
        .post('/launches')
        .send(launchDataWithoutMission)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({ error: 'Missing required data.' });

      await request(app)
        .post('/launches')
        .send(launchDataWithoutRocket)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({ error: 'Missing required data.' });

      await request(app)
        .post('/launches')
        .send(launchDataWithoutTarget)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({ error: 'Missing required data.' });

      await request(app)
        .post('/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({ error: 'Missing required data.' });
    });

    test('It should catch invalid dates', async () => {
      await request(app)
        .post('/launches')
        .send(launchDataInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({ error: 'Invalid Date.' });

      await request(app)
        .post('/launches')
        .send(launchDataPastDate)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({ error: 'Date must be in the future.' });
    });
    test('It should catch invalid planets', async () => {
      await request(app)
        .post('/launches')
        .send(launchDataInvalidPlanet)
        .expect('Content-Type', /json/)
        .expect(404)
        .expect({ error: 'Planet not found.' });
    });
  });

  describe('Test DELETE /launch', () => {
    const launch = {
      flightNumber: 100,
      mission: 'Kepler Exploration x',
      rocket: 'Explorer IS1',
      launchDate: new Date('December 27, 2030').valueOf(),
      target: 'Kepler-442 b',
      customers: ['NASA', 'ZTM'],
      upcoming: false,
      success: false,
    };
    test('It should be able to remove the default launch', async () => {
      const response = await request(app)
        .delete('/launches/100')
        .expect('Content-Type', /json/)
        .expect(200);
      response.body.launchDate = new Date(response.body.launchDate).valueOf();
      expect(response.body).toMatchObject(launch);
    });

    test('It should fail to delete unexistent launches', async () => {
      const response = await request(app)
        .delete('/launches/0')
        .expect('Content-Type', /json/)
        .expect(404);
      expect(response.body).toEqual({ error: 'Launch not found.' });
    });
  });

  describe('Test GET /planets', () => {
    beforeAll(async () => {
      await mongoConnect();
    });

    afterAll(async () => {
    // await mongoDisconnect();
    });
    it('Test if all planets are found', async () => {
      const response = await request(app)
        .get('/planets')
        .expect('Content-Type', /json/)
        .expect(200);
      // console.log(response);
      expect(response.body).toHaveLength(8);
    });
  });
});

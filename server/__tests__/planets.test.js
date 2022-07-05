/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const app = require('../src/app');

describe('Test GET /planets', () => {
  it('Test if all planets are found', async () => {
    await request(app)
      .get('/planets')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

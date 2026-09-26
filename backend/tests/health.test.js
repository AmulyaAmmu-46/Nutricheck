const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app } = require('../server');

test('GET /health returns healthy status', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'healthy');
  assert.equal(response.body.service, 'nutricheck');
});

test('GET /api/health keeps existing API health response', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'OK');
  assert.ok(response.body.message.includes('Nuricheck'));
});

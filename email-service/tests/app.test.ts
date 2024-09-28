import request from 'supertest';
import app from '../src/app';

describe('email-service service', () => {
  it('should return Hello from email-service service!', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello from email-service service!');
  });
});

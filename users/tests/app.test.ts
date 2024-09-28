import request from 'supertest';
import app from '../src/app';

describe('users service', () => {
  it('should return Hello from users service!', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello from users service!');
  });
});

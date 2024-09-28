import request from 'supertest';
import app from '../src/app';

describe('auth service', () => {
  it('should return Hello from auth service!', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello from auth service!');
  });
});

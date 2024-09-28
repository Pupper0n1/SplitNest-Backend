import request from 'supertest';
import app from '../src/app';

describe('payments service', () => {
  it('should return Hello from payments service!', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello from payments service!');
  });
});

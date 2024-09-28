import request from 'supertest';
import app from '../src/app';

describe('file-manager service', () => {
  it('should return Hello from file-manager service!', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello from file-manager service!');
  });
});

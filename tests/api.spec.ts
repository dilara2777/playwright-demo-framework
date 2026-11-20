import { test, expect } from '@playwright/test';

/**
 * Small API-testing demo using Playwright's APIRequestContext
 * against the public JSONPlaceholder fake REST API.
 * Same framework, same runner — UI and API coverage in one place.
 */
test.describe('API (JSONPlaceholder)', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';

  test('GET /posts/1 returns the expected resource', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/1`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      userId: 1,
    });
    expect(typeof body.title).toBe('string');
    expect(body.title.length).toBeGreaterThan(0);
  });

  test('GET /users returns a list of 10 users', async ({ request }) => {
    const response = await request.get(`${baseURL}/users`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(10);
    for (const user of body) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user.email).toMatch(/@/);
    }
  });

  test('POST /posts creates a resource and returns 201', async ({ request }) => {
    const response = await request.post(`${baseURL}/posts`, {
      data: { title: 'demo post', body: 'created by a Playwright API test', userId: 1 },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ title: 'demo post', userId: 1 });
    expect(body.id).toBeDefined();
  });

  test('GET /posts/99999 returns 404', async ({ request }) => {
    const response = await request.get(`${baseURL}/posts/99999`);
    expect(response.status()).toBe(404);
  });
});

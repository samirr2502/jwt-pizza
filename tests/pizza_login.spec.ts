import { test, expect } from 'playwright-test-coverage';

test('login admin', async ({ page }) => {
await page.route('*/**/api/auth', async (route) => {
  const loginReq = { email: 'd@jwt.com', password: 'a' };
  const loginRes = {
    user: {
      id: 3,
      name: 'Kai Chen',
      email: 'd@jwt.com',
      roles: [{ role: 'admin' }],
    },
    token: 'abcdef',
  };
  expect(route.request().method()).toBe('PUT');
  expect(route.request().postDataJSON()).toMatchObject(loginReq);
  await route.fulfill({ json: loginRes });
});


    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('a');
    await page.locator('div').filter({ hasText: /^Login$/ }).click();
    await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();

    // await page.getByRole('link', { name: 'Order' }).click();


    // await page.locator('.flex.flex-col.group').first().click();
    // await expect(page.getByText('Selected pizzas:')).toBeVisible();
    // await page.getByRole('button', { name: 'Checkout' }).click();
});

test('register diner', async ({ page }) => {
await page.route('*/**/api/auth', async (route) => {
  const registerReq = {name:"test1", email: 't@jwt.com', password: 't' };
  const registerRes = {
    user: {
      id: 3,
      name: 'test',
      email: 't@jwt.com',
      roles: [{ role: 'diner' }],
    },
    token: 'abcdef',
  };
  expect(route.request().method()).toBe('POST');
  expect(route.request().postDataJSON()).toMatchObject(registerReq);
  await route.fulfill({ json: registerRes });
});


    await page.goto('http://localhost:5173/');
    
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('test1');
    await page.getByRole('textbox', { name: 'Email address' }).fill('t@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('t');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();

});
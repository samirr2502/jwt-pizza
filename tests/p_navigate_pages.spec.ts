import { test, expect } from 'playwright-test-coverage';

test('has navigate no login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  expect(await page.title()).toBe('JWT Pizza');
  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
await page.getByRole('link', { name: 'Order' }).click();
await expect(page.getByText('Awesome is a click away')).toBeVisible();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await expect(page.getByText('So you want a piece of the')).toBeVisible();
await expect(page.getByText('Are you ready to embark on a')).toBeVisible();

await page.getByRole('link', { name: 'Login', exact: true }).click();
await expect(page.getByText('Are you new? Register instead.')).toBeVisible();
await page.getByRole('link', { name: 'Register' }).click();
await expect(page.getByText('Already have an account?')).toBeVisible();
await page.getByRole('main').getByText('Login').click();
await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
await page.getByRole('main').getByText('Register').click();
await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();



await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' })).toBeVisible();
await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
await expect(page.getByText('So you want a piece of the')).toBeVisible();
await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
await page.getByRole('link', { name: 'About' }).click();
await expect(page.getByText('The secret sauce')).toBeVisible();
await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
await page.getByRole('link', { name: 'History' }).click();
await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
await expect(page.getByText('© 2024 JWT Pizza LTD. All')).toBeVisible();
await expect(page.getByRole('link', { name: 'home' })).toBeVisible();
await page.getByRole('link', { name: 'home' }).click();
await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
})

test('test navigate admin login', async ({ page }) => {
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
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();

  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

});

test('test navigate diner login', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = {
      user: {
        id: 3,
        name: 'Kai Chen',
        email: 'd@jwt.com',
        roles: [{ role: 'diner' }],
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
  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();


  await page.route('*/**/api/auth', async (route) => {
    const logoutReq = { email: 'd@jwt.com', password: 'a' };
    const logoutRes = {}
    expect(route.request().method()).toBe('DELETE');
    // expect(route.request().postDataJSON()).toMatchObject(logoutReq);
    await route.fulfill({ json: logoutRes });
  });
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'home' })).toBeVisible();

});

test('test navigate not found', async ({ page }) => {
  await page.goto('http://localhost:5173/notfound')
  await expect(page.getByText('Oops')).toBeVisible();
  await expect(page.getByText('It looks like we have dropped')).toBeVisible();
})
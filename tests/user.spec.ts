import { test, expect } from 'playwright-test-coverage';

test('update user', async ({ page }) => {

    await page.route('*/**/api/auth', async (route) => {
        const registerReq = { name: "pizza diner", email: 't@jwt.com', password: 't' };
        const registerRes = {
            user: {
                id: 3,
                name: 'pizza diner',
                email: 't@jwt.com',
                roles: [{ role: 'diner' }],
            },
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(registerReq);
        await route.fulfill({ json: registerRes });
    });



    const email = `t@jwt.com`;
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('t');
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza diner');

    //New input test

    await page.route('*/**/api/user/3', async (route) => {
        const updateReq = { name: "pizza dinerx", email: 't@jwt.com' };
        const updateRes = {
            user: {
                id: 3,
                name: 'pizza dinerx',
                email: 't@jwt.com',
                roles: [{ role: 'diner' }],
            },
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(updateReq);
        await route.fulfill({ json: updateRes });
    });
    await page.getByRole('button', { name: 'Edit' }).click();

    await expect(page.locator('h3')).toContainText('Edit user');

    await page.getByRole('textbox').first().fill('pizza dinerx');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza dinerx');

    await page.route('*/**/api/auth', async (route) => {
        const logoutRes = {}
        expect(route.request().method()).toBe('DELETE');
        // expect(route.request().postDataJSON()).toMatchObject(logoutReq);
        await route.fulfill({ json: logoutRes });
    });

    await page.getByRole('link', { name: 'Logout' }).click();

    await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 't@jwt.com', password: 't' };
    const loginRes = {
      user: {
        id: 3,
        name: 'pizza dinerx',
        email: 't@jwt.com',
        roles: [{ role: 'diner' }],
      },
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
    await page.getByRole('link', { name: 'Login' }).click();


    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('t');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
});
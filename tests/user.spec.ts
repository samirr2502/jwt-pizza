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

test('list users', async ({ page }) => {

    await page.route('*/**/api/auth', async (route) => {
        const registerReq = { name: "pizza admin", email: 't@jwt.com', password: 't' };
        const registerRes = {
            user: {
                id: 3,
                name: 'pizza admin',
                email: 't@jwt.com',
                roles: [{ role: 'admin' }],
            },
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(registerReq);
        await route.fulfill({ json: registerRes });
    });


    await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
        const franchiseRes = {
            franchises: [
                {
                    id: 2,
                    name: 'LotaPizza',
                    stores: [
                        { id: 4, name: 'Lehi' },
                        { id: 5, name: 'Springville' },
                        { id: 6, name: 'American Fork' },
                    ],
                },
                { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
                { id: 4, name: 'topSpot', stores: [] },
            ],
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });
    await page.route(/\/api\/user(\?.*)?$/, async (route) => {
        // const userReq = { name: "pizza admin", email: 't@jwt.com', password: 't' };
        const usersRes = {
            users: [{
                id: 3,
                name: 'pizza admin',
                email: 't@jwt.com',
                roles: [{ role: 'admin' }],
            },{
                id: 4,
                name: 'pizza diner',
                email: 'd@jwt.com',
                roles: [{ role: 'diner' }],
            }],
            more: false
        };
        expect(route.request().method()).toBe('GET');
        // expect(route.request().postDataJSON()).toMatchObject(registerReq);
        await route.fulfill({ json: usersRes });
    });

    const email = `t@jwt.com`;
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza admin');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('t');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('link', { name: 'Admin', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Admin', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();

    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza admin' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 't@jwt.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'admin', exact: true })).toBeVisible();
    
    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
    await page.getByRole('button', { name: 'Remove' }).click();
});

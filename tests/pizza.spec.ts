import { test, expect } from 'playwright-test-coverage';

test('has title', async ({page})=>{
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');
})

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.locator('div').filter({ hasText: /^Login$/ }).click();
});
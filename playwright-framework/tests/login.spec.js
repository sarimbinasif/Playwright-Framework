import { test, expect } from '../fixtures/baseFixture.js';
import { allure } from 'allure-playwright';
import { DataParser } from '../utils/dataParser.js';
import { logger } from '../utils/logger.js';

const users = DataParser.readJSON('users.json');

test.describe('Login Tests @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-01: Standard user can log in successfully', async ({
    loginPage,
    inventoryPage,
  }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Successful login');
    await allure.severity('critical');
    await allure.tag('smoke');
    await allure.description('Verify that a standard user with valid credentials can log in.');

    const { username, password } = users.standard;
    await loginPage.login(username, password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    expect(await inventoryPage.getCurrentURL()).toContain('/inventory.html');
  });

  test('TC-02: Locked-out user sees error message', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Locked user handling');
    await allure.severity('normal');

    const { username, password, expectedError } = users.lockedOut;
    await loginPage.login(username, password);
    expect(await loginPage.isErrorVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toBe(expectedError);
  });

  test('TC-03: Invalid credentials show error', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Invalid credentials');
    await allure.severity('critical');

    const { username, password, expectedError } = users.invalid;
    await loginPage.login(username, password);
    expect(await loginPage.getErrorMessage()).toBe(expectedError);
  });

  test('TC-04: Empty username shows validation error', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Field validation');
    await allure.severity('normal');

    const { username, password, expectedError } = users.emptyUsername;
    await loginPage.login(username, password);
    expect(await loginPage.getErrorMessage()).toBe(expectedError);
  });

  test('TC-05: Empty password shows validation error', async ({ loginPage }) => {
    await allure.epic('Authentication');
    await allure.feature('Login');
    await allure.story('Field validation');
    await allure.severity('normal');

    const { username, password, expectedError } = users.emptyPassword;
    await loginPage.login(username, password);
    expect(await loginPage.getErrorMessage()).toBe(expectedError);
  });

  const loginScenarios = [
    { name: 'standard user', data: users.standard },
    { name: 'problem user', data: users.problem },
    { name: 'performance glitch user', data: users.performanceGlitch },
  ];

  for (const scenario of loginScenarios) {
    test(`TC-06 [DDT]: Login works for ${scenario.name}`, async ({
      loginPage,
      inventoryPage,
    }) => {
      await allure.epic('Authentication');
      await allure.feature('Login');
      await allure.story('Data-driven login');
      await allure.severity('critical');
      await allure.tag('data-driven');
      await allure.parameter('userType', scenario.name);

      logger.info(`Testing login for: ${scenario.name}`);
      await loginPage.login(scenario.data.username, scenario.data.password);
      expect(await inventoryPage.isLoaded()).toBeTruthy();
    });
  }
});

test.describe('Logout Tests', () => {
  test('TC-07: User can log out successfully', async ({
    loginPage,
    inventoryPage,
  }) => {
    await allure.epic('Authentication');
    await allure.feature('Logout');
    await allure.story('Standard logout');
    await allure.severity('critical');

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.logout();
    expect(await loginPage.getCurrentURL()).toBe('https://www.saucedemo.com/');
  });
});

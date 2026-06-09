import { test, expect } from '../fixtures/baseFixture.js';
import { allure } from 'allure-playwright';
import { DataParser } from '../utils/dataParser.js';

const users = DataParser.readJSON('users.json');
const checkoutData = DataParser.readJSON('checkout.json');

test.describe('Checkout Tests @regression', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
  });

  test('TC-15: Cart shows added items', async ({ cartPage }) => {
    await allure.epic('Shopping');
    await allure.feature('Cart');
    await allure.story('View cart');
    await allure.severity('normal');

    expect(await cartPage.isLoaded()).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBe(1);
    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('TC-16: Complete a successful checkout', async ({
    cartPage,
    checkoutPage,
  }) => {
    await allure.epic('Shopping');
    await allure.feature('Checkout');
    await allure.story('Successful checkout');
    await allure.severity('critical');
    await allure.tag('smoke');
    await allure.description('Verify the full end-to-end purchase flow.');

    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    expect(await checkoutPage.getConfirmationMessage()).toBe(
      'Thank you for your order!'
    );
  });

  test('TC-17: Can continue shopping from cart', async ({
    cartPage,
    inventoryPage,
  }) => {
    await allure.epic('Shopping');
    await allure.feature('Cart');
    await allure.story('Navigation');
    await allure.severity('minor');

    await cartPage.continueShopping();
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  for (const customer of checkoutData.validCustomers) {
    test(`TC-18 [DDT]: Checkout works for ${customer.firstName} ${customer.lastName}`, async ({
      cartPage,
      checkoutPage,
    }) => {
      await allure.epic('Shopping');
      await allure.feature('Checkout');
      await allure.story('Data-driven checkout');
      await allure.severity('critical');
      await allure.tag('data-driven');
      await allure.parameter('customer', `${customer.firstName} ${customer.lastName}`);
      await allure.parameter('postalCode', customer.postalCode);

      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo(
        customer.firstName,
        customer.lastName,
        customer.postalCode
      );
      await checkoutPage.continueToOverview();
      await checkoutPage.finishOrder();
      expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    });
  }

  for (const customer of checkoutData.invalidCustomers) {
    const missingField =
      !customer.firstName ? 'First Name' :
      !customer.lastName ? 'Last Name' : 'Postal Code';

    test(`TC-19 [DDT]: Checkout fails when ${missingField} is empty`, async ({
      cartPage,
      checkoutPage,
    }) => {
      await allure.epic('Shopping');
      await allure.feature('Checkout');
      await allure.story('Field validation');
      await allure.severity('normal');
      await allure.tag('data-driven');
      await allure.tag('negative');
      await allure.parameter('missingField', missingField);

      await cartPage.proceedToCheckout();
      await checkoutPage.fillCustomerInfo(
        customer.firstName,
        customer.lastName,
        customer.postalCode
      );
      await checkoutPage.continueToOverview();
      expect(await checkoutPage.getErrorMessage()).toBe(customer.expectedError);
    });
  }
});

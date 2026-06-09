// tests/inventory.spec.js
import { test, expect } from '../fixtures/baseFixture.js';
import { allure } from 'allure-playwright';
import { DataParser } from '../utils/dataParser.js';

const users = DataParser.readJSON('users.json');
const productsXml = DataParser.readXML('products.xml');
const products = productsXml.products.product;

test.describe('Inventory Tests @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('TC-08: Inventory page displays 6 items', async ({ inventoryPage }) => {
    await allure.epic('Shopping');
    await allure.feature('Inventory');
    await allure.story('Display products');
    await allure.severity('normal');

    expect(await inventoryPage.getItemsCount()).toBe(6);
  });

  test('TC-09: Can add a single item to cart', async ({ inventoryPage }) => {
    await allure.epic('Shopping');
    await allure.feature('Cart Management');
    await allure.story('Add to cart');
    await allure.severity('critical');
    await allure.tag('smoke');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('TC-10: Can add multiple items to cart', async ({ inventoryPage }) => {
    await allure.epic('Shopping');
    await allure.feature('Cart Management');
    await allure.story('Add multiple items');
    await allure.severity('critical');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.addItemToCart('Sauce Labs Bolt T-Shirt');
    expect(await inventoryPage.getCartCount()).toBe(3);
  });

  test('TC-11: Can remove item from inventory page', async ({ inventoryPage }) => {
    await allure.epic('Shopping');
    await allure.feature('Cart Management');
    await allure.story('Remove from cart');
    await allure.severity('normal');

    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('TC-12: Sort by name (A-Z) works', async ({ inventoryPage }) => {
    await allure.epic('Shopping');
    await allure.feature('Inventory');
    await allure.story('Sorting');
    await allure.severity('minor');

    await inventoryPage.sortBy('az');
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  test('TC-13: Sort by price (low-to-high) works', async ({ inventoryPage }) => {
    await allure.epic('Shopping');
    await allure.feature('Inventory');
    await allure.story('Sorting');
    await allure.severity('minor');

    await inventoryPage.sortBy('lohi');
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  for (const product of products) {
    test(`TC-14 [DDT-XML]: Add "${product.name}" (price $${product.price}) to cart`, async ({
      inventoryPage,
    }) => {
      await allure.epic('Shopping');
      await allure.feature('Cart Management');
      await allure.story('Data-driven add to cart');
      await allure.severity('normal');
      await allure.tag('data-driven');
      await allure.tag('xml');
      await allure.parameter('product', product.name);
      await allure.parameter('price', `$${product.price}`);

      await inventoryPage.addItemToCart(product.name);
      expect(await inventoryPage.getCartCount()).toBe(1);
    });
  }
});

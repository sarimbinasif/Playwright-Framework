# Playwright Automation Framework

A robust, maintainable test automation framework built with **Playwright + JavaScript** following industry best practices. Targets the [SauceDemo](https://www.saucedemo.com/) e-commerce demo application.

## Features

- **Page Object Model (POM)** — clean separation of locators, actions, and tests
- **Data-Driven Testing** — JSON and XML test data sources
- **Allure Reporting** — rich HTML reports with screenshots and logs
- **Custom Hooks** — automatic screenshot on failure, structured logging
- **Utilities Layer** — config reader, logger, data parser, wait utils, screenshot util
- **Multi-browser support** — Chromium, Firefox, WebKit
- **Custom Fixtures** — page objects injected automatically into tests

## Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org))
- **Java JDK** 8+ (required by the Allure CLI for report generation)
- **Git** (for cloning the repo)

Verify versions:

```bash
node --version    # should be >= v18
java -version     # required for Allure
```

## Setup

```bash
# 1. Clone the repo (or unzip the submission)
git clone <repo-url>
cd playwright-framework

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 4. (Optional) Copy the env example
cp .env.example .env
```

## Running Tests

```bash
#all tests, all browsers
npm test

# Run with browser visible
npm run test:headed

# chrome only
npm run test:chrome

# only smoke tests
npm run test:smoke

# only regression tests
npm run test:regression

# Run a single spec file
npx playwright test tests/login.spec.js

# Run a single test by name
npx playwright test -g "TC-01"

# Run in debug mode (step through with inspector)
npx playwright test --debug
```

## Generating the Allure Report

```bash
# Run tests first to produce allure-results
npm test

# Generate and open the HTML report
npm run report

# Or just generate without opening
npm run report:generate
```

> The Allure command line is bundled via `allure-commandline` npm package. If you prefer the global install, run: `npm install -g allure-commandline` and use `allure generate` and then `allure open allure-report`.

## Folder Structure

```
playwright-framework/
├── tests/                  # Spec files (test cases)
│   ├── login.spec.js
│   ├── inventory.spec.js
│   └── checkout.spec.js
├── pages/                  # Page Object classes
│   ├── BasePage.js         # Parent class — shared methods
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── utils/                  # Utilities layer
│   ├── configReader.js     # Reads config.json + .env
│   ├── logger.js           # Winston-based logger
│   ├── screenshotUtil.js   # Screenshot helpers
│   ├── dataParser.js       # JSON + XML parser
│   └── waitUtils.js        # Explicit/implicit wait helpers
├── test-data/              # Data-driven inputs
│   ├── users.json          # Login credentials
│   ├── checkout.json       # Customer info
│   └── products.xml        # Product data (XML)
├── config/
│   └── config.json         # Base URL, timeouts, env config
├── fixtures/
│   └── baseFixture.js      # Custom test fixture + global hooks
├── docs/
│   └── architecture.md     # Architecture diagram and notes
├── playwright.config.js    # Playwright runner config
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Test Coverage

The framework includes test cases (~25) across:

| Module | Cases |
|--------|-------|
| Login (positive + negative + DDT) | 7 |
| Logout | 1 |
| Inventory (add/remove/sort + DDT XML) | 10 |
| Cart | 1 |
| Checkout (positive + negative + DDT) | 7+ |

## Architecture Diagram

See [`docs/architecture.md`](docs/architecture.md).

## Configuration

Edit `config/config.json` to change defaults, or override via `.env`:

| Field | Description | Default |
|-------|-------------|---------|
| `baseURL` | App URL | `https://www.saucedemo.com` |
| `headless` | Run browsers headless | `true` |
| `actionTimeout` | Per-action timeout (ms) | `10000` |
| `navigationTimeout` | Page navigation timeout | `30000` |

## Hooks

The framework uses Playwright hooks via the custom fixture in `fixtures/baseFixture.js`:

- `beforeEach` — logs test start
- `afterEach` — captures screenshot on failure, attaches it to the Allure report, logs result

Spec-level `test.describe.beforeEach` hooks handle test-specific setup (e.g., login before checkout tests).

## Authors

- Sarim Asif (22k-4259)
- Kashan Alam (22k-4164)

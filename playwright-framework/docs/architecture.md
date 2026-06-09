# Framework Architecture

## Layered Design

```
┌────────────────────────────────────────────────────────────────┐
│                       TEST EXECUTION LAYER                     │
│                  (tests/*.spec.js)                             │
│                                                                │
│   login.spec.js    inventory.spec.js    checkout.spec.js       │
└──────────────────────────┬─────────────────────────────────────┘
                           │ uses
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                       FIXTURE LAYER                            │
│                 (fixtures/baseFixture.js)                      │
│                                                                │
│   • Injects page objects into every test                       │
│   • beforeEach / afterEach hooks                               │
│   • Screenshot-on-failure capture                              │
└──────────────────────────┬─────────────────────────────────────┘
                           │ instantiates
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                    PAGE OBJECT LAYER                           │
│                       (pages/*)                                │
│                                                                │
│         ┌─────────────────┐                                    │
│         │   BasePage      │ ◄── parent (shared methods)        │
│         └────────┬────────┘                                    │
│                  │                                             │
│       ┌──────────┼──────────┬──────────────┐                   │
│       ▼          ▼          ▼              ▼                   │
│   LoginPage  Inventory   CartPage   CheckoutPage               │
│              Page                                              │
└──────────────────────────┬─────────────────────────────────────┘
                           │ uses
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                       UTILITIES LAYER                          │
│                       (utils/*)                                │
│                                                                │
│  configReader │ logger │ screenshotUtil │ dataParser │ waitUtil│
└──────────────────────────┬─────────────────────────────────────┘
                           │ reads
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                       DATA & CONFIG LAYER                      │
│                                                                │
│   config/config.json  │  test-data/*.json  │  test-data/*.xml  │
│   .env                │                                        │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                    REPORTING & ARTIFACTS                       │
│                                                                │
│  allure-results/  │  playwright-report/  │  logs/  │ screenshots/│
└────────────────────────────────────────────────────────────────┘
```

## Design Principles

1. **Separation of concerns** — Tests describe *what* to verify; page objects describe *how*; utilities provide *infrastructure*.
2. **DRY** — Reusable methods in `BasePage` and `utils/` prevent duplication.
3. **Configurable** — Environment-specific values live in `config/` and `.env`, not in code.
4. **Data-driven** — Test inputs live in `test-data/`, so adding scenarios doesn't require code changes.
5. **Observable** — Logging, screenshots, and Allure reports make failures easy to diagnose.

## Data Flow for a Test

1. Playwright's runner picks up `tests/*.spec.js`.
2. The test imports `test` from `fixtures/baseFixture.js` — gets `loginPage`, `inventoryPage`, etc. injected automatically.
3. `beforeEach` hook fires → logs test start.
4. Test calls page object methods → which call locators and `BasePage` helpers → which use `WaitUtils` and `logger`.
5. Data-driven tests use `DataParser.readJSON()` / `readXML()` to read `test-data/`.
6. `afterEach` hook fires → if failure, capture screenshot via `ScreenshotUtil` and attach to Allure.
7. Allure reporter writes results to `allure-results/` → CLI generates `allure-report/`.

## Why this design

| Decision | Reason |
|----------|--------|
| ES Modules (`import/export`) | Modern, matches Playwright examples |
| Custom fixture over manual `new LoginPage(page)` | Less boilerplate; fixtures handle lifecycle |
| Winston logger | Multi-transport (console + file), industry standard |
| Allure over default reporter | Required by rubric; richer than built-in HTML |
| JSON + XML data sources | Project rubric requires both options demonstrated |
| `fast-xml-parser` | Lightweight, no native deps |

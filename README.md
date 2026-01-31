# Playwright Automation Framework

Production-ready Playwright automation framework with Page Object Model (POM) pattern.

## Features

- **Page Object Model** - Maintainable and reusable page objects
- **Single Browser** - Chromium only for consistent test execution
- **Custom Fixtures** - Extended test functionality
- **Test Utilities** - Logger, test data management
- **CI/CD Ready** - Environment variable support
- **HTML Reports** - Built-in Playwright reporting

## Project Structure

```
├── config/
│   └── playwright.config.js    # Playwright configuration
├── data/
│   └── users.json              # Test data
├── screenshots/                # Screenshot output
├── tests/e2e/
│   ├── fixtures/
│   │   └── base.fixture.js     # Custom test fixtures
│   ├── pages/
│   │   ├── base.page.js        # Base page class
│   │   ├── home.page.js        # Home page object
│   │   └── login.page.js       # Login page object
│   ├── utils/
│   │   ├── logger.util.js      # Logging utility
│   │   └── test-data.util.js   # Test data utility
│   └── tests/
│       └── example.spec.js     # Example tests
├── package.json
├── playwright.config.js
├── .env.example
└── .gitignore
```

## Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

## Usage

```bash
# Run all tests
npm test

# Run tests in headed mode
HEADED=true npm test

# Run with debug
npm run test:debug

# View HTML report
npm run test:report

# Lint code
npm run lint
```

## Configuration

Edit `playwright.config.js` to customize:
- Base URL
- Timeouts
- Reporter settings
- Browser options

## Adding New Tests

1. Create page object in `tests/e2e/pages/`
2. Add selectors and methods
3. Create test file in `tests/e2e/tests/`
4. Import and use page objects

## Best Practices

- Use `data-testid` attributes for selectors
- Keep page objects focused and single-purpose
- Use explicit waits over implicit waits
- Clean up after tests if needed
- Use environment variables for sensitive data

import { chromium } from '@playwright/test';
import { HomePage } from './pages/home.page';

async function globalSetup(config) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Global setup: Resetting data...');
    const homePage = new HomePage(page);
    await homePage.resetData("Phones");
    console.log('Global setup: Data reset complete.');
  } catch (error) {
    console.error('Global setup: Failed to reset data', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;

mport { Page, Locator, Keyboard } from '@playwright/test';
import logger from '../utils/logger'; // <-- Winston logger

export class BasePage {
  protected page: Page;
  protected keyboard: Keyboard;

  constructor(page: Page) {
    this.page = page;
    this.keyboard = page.keyboard;
  }

  // Getter: current class name for logging
  private get className(): string {
    return this.constructor.name;
  }

  // Helper: Log success
  private logSuccess(action: string, desc?: string) {
    const message = `[${this.className}] ✅ SUCCESS: ${action} ${desc ? `→ ${desc}` : ''}`;
    logger.info(message);
  }

  // Helper: Log failure
  private logFailure(action: string, error: any, desc?: string) {
    const message = `[${this.className}] ❌ FAILURE: ${action} ${desc ? `→ ${desc}` : ''}\n   Error: ${error}`;
    logger.error(message);
  }

  // Click
  async click(locator: Locator, description?: string, timeout?: number): Promise<void> {
    const desc = description || locator.toString();
    try {
      logger.info(`[${this.className}] 🖱️ Click on: ${desc}`);
      await locator.click({ timeout });
      this.logSuccess('Click', desc);
    } catch (error) {
      this.logFailure('Click', error, desc);
      throw error;
    }
  }

  // Double Click
  async doubleClick(locator: Locator, description?: string, timeout?: number): Promise<void> {
    const desc = description || locator.toString();
    try {
      logger.info(`[${this.className}] 🖱️ Double click on: ${desc}`);
      await locator.dblclick({ timeout });
      this.logSuccess('Double Click', desc);
    } catch (error) {
      this.logFailure('Double Click', error, desc);
      throw error;
    }
  }

  // Send Keys (Type)
  async sendKeys(locator: Locator, text: string, description?: string, timeout?: number): Promise<void> {
    const desc = description || locator.toString();
    try {
      logger.info(`[${this.className}] ⌨️ Send keys "${text}" to: ${desc}`);
      await locator.fill(text, { timeout });
      this.logSuccess(`Send Keys "${text}"`, desc);
    } catch (error) {
      this.logFailure(`Send Keys "${text}"`, error, desc);
      throw error;
    }
  }

  // Hover
  async hover(locator: Locator, description?: string, timeout?: number): Promise<void> {
    const desc = description || locator.toString();
    try {
      logger.info(`[${this.className}] 🖱️ Hover over: ${desc}`);
      await locator.hover({ timeout });
      this.logSuccess('Hover', desc);
    } catch (error) {
      this.logFailure('Hover', error, desc);
      throw error;
    }
  }

  // Check Checkbox
  async check(locator: Locator, description?: string, timeout?: number): Promise<void> {
    const desc = description || locator.toString();
    try {
      logger.info(`[${this.className}] ☑️ Check: ${desc}`);
      await locator.check({ timeout });
      this.logSuccess('Check', desc);
    } catch (error) {
      this.logFailure('Check', error, desc);
      throw error;
    }
  }

  // Upload File
  async uploadFile(locator: Locator, filePath: string, description?: string, timeout?: number): Promise<void> {
    const desc = description || locator.toString();
    try {
      logger.info(`[${this.className}] 📤 Upload file "${filePath}" to: ${desc}`);
      await locator.setInputFiles(filePath, { timeout });
      this.logSuccess(`Upload File "${filePath}"`, desc);
    } catch (error) {
      this.logFailure(`Upload File "${filePath}"`, error, desc);
      throw error;
    }
  }

  // Add other methods similarly, accepting Locator only
}

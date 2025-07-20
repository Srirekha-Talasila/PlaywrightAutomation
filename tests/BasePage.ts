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

  // Uncheck Checkbox
async uncheck(
  locator: Locator,
  description?: string,
  timeout?: number
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] ☑️ Uncheck: ${desc}`);
    await locator.uncheck({ timeout });
    this.logSuccess('Uncheck', desc);
  } catch (error) {
    this.logFailure('Uncheck', error, desc);
    throw error;
  }
}

// Get Text Content
async getText(
  locator: Locator,
  description?: string,
  timeout?: number
): Promise<string> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] 📄 Get text from: ${desc}`);
    // Playwright Locator doesn't support timeout on textContent, so use waitFor with timeout
    await locator.waitFor({ state: 'visible', timeout });
    const text = await locator.textContent();
    this.logSuccess('Get Text', desc);
    return text?.trim() || '';
  } catch (error) {
    this.logFailure('Get Text', error, desc);
    throw error;
  }
}

// Press Keyboard Key
async pressKey(
  key: string,
  description?: string
): Promise<void> {
  const desc = description || key;
  try {
    logger.info(`[${this.className}] ⌨️ Press key: ${desc}`);
    await this.keyboard.press(key);
    this.logSuccess('Press Key', desc);
  } catch (error) {
    this.logFailure('Press Key', error, desc);
    throw error;
  }
}

// Scroll Into View
async scrollIntoView(
  locator: Locator,
  description?: string,
  timeout?: number
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] ↕️ Scroll into view: ${desc}`);
    await locator.scrollIntoViewIfNeeded({ timeout });
    this.logSuccess('Scroll Into View', desc);
  } catch (error) {
    this.logFailure('Scroll Into View', error, desc);
    throw error;
  }
}

// Download File
async downloadFile(
  locator: Locator,
  downloadDir: string,
  description?: string,
  timeout?: number
): Promise<string> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] 📥 Download file from: ${desc}`);
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout }),
      locator.click(),
    ]);
    const savePath = `${downloadDir}/${await download.suggestedFilename()}`;
    await download.saveAs(savePath);
    this.logSuccess('Download File', desc);
    return savePath;
  } catch (error) {
    this.logFailure('Download File', error, desc);
    throw error;
  }
}
}

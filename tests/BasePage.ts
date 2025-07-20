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

  // Select Dropdown by Visible Text
async selectByVisibleText(
  locator: Locator,
  visibleText: string,
  description?: string,
  timeout?: number
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] 🔽 Select "${visibleText}" from dropdown: ${desc}`);
    await locator.selectOption({ label: visibleText, timeout });
    this.logSuccess(`Select By Visible Text "${visibleText}"`, desc);
  } catch (error) {
    this.logFailure(`Select By Visible Text "${visibleText}"`, error, desc);
    throw error;
  }
}

// Select Dropdown by Value
async selectByValue(
  locator: Locator,
  value: string,
  description?: string,
  timeout?: number
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] 🔽 Select value="${value}" from dropdown: ${desc}`);
    await locator.selectOption({ value, timeout });
    this.logSuccess(`Select By Value "${value}"`, desc);
  } catch (error) {
    this.logFailure(`Select By Value "${value}"`, error, desc);
    throw error;
  }
}

// Check Checkbox
async check(
  locator: Locator,
  description?: string,
  timeout?: number
): Promise<void> {
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

// Get Text
async getText(
  locator: Locator,
  description?: string,
  timeout?: number
): Promise<string> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] 📄 Get text from: ${desc}`);
    await locator.waitFor({ state: 'visible', timeout }); // ensure visible before getText
    const text = await locator.textContent();
    this.logSuccess('Get Text', desc);
    return text?.trim() || '';
  } catch (error) {
    this.logFailure('Get Text', error, desc);
    throw error;
  }
}

// Is Displayed (Visible)
async isDisplayed(
  locator: Locator,
  timeout?: number
): Promise<boolean> {
  try {
    // Playwright doesn't support timeout on isVisible, so emulate with waitFor + catch
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

// Is Enabled
async isEnabled(
  locator: Locator,
  timeout?: number
): Promise<boolean> {
  try {
    const start = Date.now();
    while (!await locator.isEnabled()) {
      if (timeout && Date.now() - start > timeout) return false;
      await new Promise(r => setTimeout(r, 100));
    }
    return true;
  } catch {
    return false;
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

// Hover Over Element
async hover(
  locator: Locator,
  description?: string,
  timeout?: number
): Promise<void> {
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

  async navigate(
  url: string,
  timeout: number = 30000
): Promise<void> {
  try {
    logger.info(`[${this.className}] 🌐 Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'load', timeout });
    this.logSuccess('Navigate', url);
  } catch (error) {
    this.logFailure('Navigate', error, url);
    throw error;
  }
}

async refreshPage(
  timeout: number = 30000,
  description?: string
): Promise<void> {
  const desc = description || 'Page refresh';
  try {
    logger.info(`[${this.className}] 🔄 Refreshing page`);
    await this.page.reload({ timeout, waitUntil: 'load' });
    this.logSuccess('Refresh Page', desc);
  } catch (error) {
    this.logFailure('Refresh Page', error, desc);
    throw error;
  }
}

  // Wait for element to be visible
async waitForVisible(
  locator: Locator,
  description?: string,
  timeout = 10000
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] ⏳ Waiting for visible: ${desc}`);
    await locator.waitFor({ state: 'visible', timeout });
    this.logSuccess('Wait For Visible', desc);
  } catch (error) {
    this.logFailure('Wait For Visible', error, desc);
    throw error;
  }
}

// Wait for element to be hidden
async waitForHidden(
  locator: Locator,
  description?: string,
  timeout = 10000
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] ⏳ Waiting for hidden: ${desc}`);
    await locator.waitFor({ state: 'hidden', timeout });
    this.logSuccess('Wait For Hidden', desc);
  } catch (error) {
    this.logFailure('Wait For Hidden', error, desc);
    throw error;
  }
}

// Wait for element to be attached to DOM
async waitForAttached(
  locator: Locator,
  description?: string,
  timeout = 10000
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] ⏳ Waiting for attached: ${desc}`);
    await locator.waitFor({ state: 'attached', timeout });
    this.logSuccess('Wait For Attached', desc);
  } catch (error) {
    this.logFailure('Wait For Attached', error, desc);
    throw error;
  }
}

// Wait for element to be detached (removed) from DOM
async waitForDetached(
  locator: Locator,
  description?: string,
  timeout = 10000
): Promise<void> {
  const desc = description || locator.toString();
  try {
    logger.info(`[${this.className}] ⏳ Waiting for detached: ${desc}`);
    await locator.waitFor({ state: 'detached', timeout });
    this.logSuccess('Wait For Detached', desc);
  } catch (error) {
    this.logFailure('Wait For Detached', error, desc);
    throw error;
  }
}

// Wait for URL to match a pattern or string
async waitForUrl(
  url: string | RegExp | ((url: URL) => boolean),
  description?: string,
  timeout = 10000
): Promise<void> {
  const desc = description || `URL to match ${url.toString()}`;
  try {
    logger.info(`[${this.className}] ⏳ Waiting for URL: ${desc}`);
    await this.page.waitForURL(url, { timeout });
    this.logSuccess('Wait For URL', desc);
  } catch (error) {
    this.logFailure('Wait For URL', error, desc);
    throw error;
  }
}

// Wait for page load/navigation event (load, domcontentloaded, networkidle)
async waitForLoadState(
  state: 'load' | 'domcontentloaded' | 'networkidle' = 'load',
  description?: string,
  timeout = 10000
): Promise<void> {
  const desc = description || `Page to reach load state: ${state}`;
  try {
    logger.info(`[${this.className}] ⏳ Waiting for load state: ${state}`);
    await this.page.waitForLoadState(state, { timeout });
    this.logSuccess('Wait For Load State', desc);
  } catch (error) {
    this.logFailure('Wait For Load State', error, desc);
    throw error;
  }
}

  async getTitle(): Promise<string> {
  try {
    const title = await this.page.title();
    logger.info(`[${this.className}] 📄 Got page title: "${title}"`);
    return title;
  } catch (error) {
    logger.error(`[${this.className}] ❌ Failed to get page title\n   Error: ${error}`);
    throw error;
  }
}

  
}

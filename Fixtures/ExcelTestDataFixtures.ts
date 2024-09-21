
import { test as base } from '@playwright/test';
import { TestDataExcelUtils } from '../utilities/ExcelTestData';

type MyFixtures = {
    testDataSheet: TestDataExcelUtils;
   
  }

  // Extend base test by providing custom page object fixture.
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
    testDataSheet: async ({ page  }, use) => {
      await use(new TestDataExcelUtils("",""));
    }
  });
  
  export { expect } from '@playwright/test';
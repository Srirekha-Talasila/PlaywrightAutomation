import * as XLSX from 'xlsx';
import * as fs from 'fs';

/**
 * Generic dictionary type to represent Excel row data.
 * Allows for dynamic keys and values (strings or numbers).
 */
type ExcelRow = { [key: string]: string | number };


/**
 * Reads test data from an Excel file.
 * 
 * @param excelFilePath Path to the Excel file.
 * @param sheetName Name of the sheet to read.
 * @param scenarioName Name of the scenario to find.
 * @returns Promise resolving to the scenario data or undefined.
 */
export const getTestData = async (
    sheetName: string,
    scenarioName: string
  ): Promise<ExcelRow> => {

    let excelFilePath = "testdata\\Testdata.xlsx";
    try {
      // Check if file exists
      if (!fs.existsSync(excelFilePath)) {
        throw new Error(`File '${excelFilePath}' not found.`);
      }
  
      // Read Excel file
      const workbook = XLSX.readFile(excelFilePath);
  
      // Check if workbook is valid
      if (!workbook || !workbook.SheetNames.length) {
        throw new Error(`Invalid Excel file: ${excelFilePath}`);
      }
  
      // Check if sheet exists
      if (!workbook.SheetNames.includes(sheetName)) {
        throw new Error(`Sheet '${sheetName}' not found in file '${excelFilePath}'.`);
      }
  
      // Get specified sheet
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert sheet to JSON
      const data: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);
  
      // Find scenario data
      const scenarioData = data.find((row) => row.ScenarioName === scenarioName);
  
      if(scenarioData == undefined)
        throw new Error(` Scenario '${scenarioName}' NOT FOUND`);
      return scenarioData;
    } catch (error) {
      throw new Error(`Error reading test data: ${error.message}`);
    }
  };
  
  
  
  
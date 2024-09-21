
import * as XLSX from 'xlsx';
import * as fs from 'fs';


interface ExcelRow { 
    [key: string]: string | number ;
};

export class TestDataExcelUtils {

    excelFilePath:string;
    sheetName:string;

    

    constructor(filePath:string,sheetName:string) {
        this.excelFilePath = filePath;
        this.sheetName = sheetName;
    }

    async getTestdata(scenarioName: string) {
                try {
                // Check if file exists
                if (!fs.existsSync(this.excelFilePath)) {
                    throw new Error(`File '${this.excelFilePath}' not found.`);
                }
                // Read Excel file
                const workbook = XLSX.readFile(this.excelFilePath);
            
                // Check if workbook is valid
                if (!workbook || !workbook.SheetNames.length) {
                    throw new Error(`Invalid Excel file: ${this.excelFilePath}`);
                }
            
                // Check if sheet exists
                if (!workbook.SheetNames.includes(this.sheetName)) {
                    throw new Error(`Sheet '${this.sheetName}' not found in file '${this.excelFilePath}'.`);
                }
            
                // Get specified sheet
                const worksheet = workbook.Sheets[this.sheetName];
            
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
     }


}


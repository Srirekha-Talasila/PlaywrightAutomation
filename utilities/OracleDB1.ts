import oracledb from 'oracledb';
import * as fs from 'fs/promises';

export class OracleUtility {
    private connection: oracledb.Connection;

    constructor(private config: oracledb.ConnectionAttributes) {}

    async connect(): Promise<void> {
        try {
            this.connection = await oracledb.getConnection(this.config);
            console.log('Connected to Oracle Database');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    // Overloaded insert method
    async insert(query: string, binds?: Record<string, any>): Promise<number>;
    async insert(sqlFilePath: string): Promise<number>;
    async insert(queryOrFile: string, binds?: Record<string, any>): Promise<number> {
        const query = await this.getQuery(queryOrFile, binds);
        const result = await this.executeQuery(query, binds);
        return result.rowsAffected; // Return the number of rows affected
    }

    // Overloaded select method
    async select(query: string, binds?: Record<string, any>): Promise<any>;
    async select(sqlFilePath: string): Promise<any>;
    async select(queryOrFile: string, binds?: Record<string, any>): Promise<any> {
        const query = await this.getQuery(queryOrFile, binds);
        return await this.executeQuery(query, binds);
    }

    // Overloaded update method
    async update(query: string, binds?: Record<string, any>): Promise<number>;
    async update(sqlFilePath: string): Promise<number>;
    async update(queryOrFile: string, binds?: Record<string, any>): Promise<number> {
        const query = await this.getQuery(queryOrFile, binds);
        const result = await this.executeQuery(query, binds);
        return result.rowsAffected; // Return the number of rows affected
    }

    // Overloaded delete method
    async delete(query: string, binds?: Record<string, any>): Promise<number>;
    async delete(sqlFilePath: string): Promise<number>;
    async delete(queryOrFile: string, binds?: Record<string, any>): Promise<number> {
        const query = await this.getQuery(queryOrFile, binds);
        const result = await this.executeQuery(query, binds);
        return result.rowsAffected; // Return the number of rows affected
    }

    private async getQuery(queryOrFile: string, binds?: Record<string, any>): Promise<string> {
        // If binds are provided, we assume it's a raw query
        if (binds) {
            return queryOrFile; // Return the raw query if binds are provided
        } else {
            // If no binds, check if the input is a file path or a raw query
            try {
                const stats = await fs.stat(queryOrFile); // Check if it's a file
                if (stats.isFile()) {
                    return await this.readSQLFile(queryOrFile); // Read from .sql file if it's a file
                }
            } catch (err) {
                // If an error occurs (e.g., file doesn't exist), treat it as a raw query
                console.warn(`Could not read from file ${queryOrFile}, treating as raw query: ${err}`);
                return queryOrFile; // Return it as a raw query
            }
            // If it's not a file, return it as a raw query
            return queryOrFile;
        }
    }
    
    // Helper method to execute query with or without parameters
    private async executeQuery(query: string, binds?: Record<string, any>): Promise<oracledb.Result<any>> {
        try {
            const options: oracledb.BindParameters = binds ? binds : {};
            const result = await this.connection.execute(query, options);
            return result; // Return the result object
        } catch (error) {
            console.error('Query execution failed:', error);
            throw error;
        }
    }

    // Helper method to read .sql file
    private async readSQLFile(filePath: string): Promise<string> {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return fileContent;
        } catch (error) {
            console.error(`Failed to read file at ${filePath}:`, error);
            throw error;
        }
    }

    async close(): Promise<void> {
        try {
            await this.connection.close();
            console.log('Connection closed');
        } catch (error) {
            console.error('Error closing connection:', error);
        }
    }
}

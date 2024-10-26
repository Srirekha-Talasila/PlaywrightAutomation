import sql from 'mssql';
import * as fs from 'fs/promises';

export class SQLServerUtility {
    private pool: sql.ConnectionPool;

    constructor(config: sql.config) {
        this.pool = new sql.ConnectionPool(config);
    }

    async connect(): Promise<void> {
        try {
            await this.pool.connect();
            console.log('Connected to SQL Server');
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    // Overloaded insert method
    async insert(query: string, params?: Record<string, any>): Promise<number>;
    async insert(sqlFilePath: string): Promise<number>;
    async insert(queryOrFile: string, params?: Record<string, any>): Promise<number> {
        const query = await this.getQuery(queryOrFile, params);
        const result = await this.executeQuery(query, params);
        return result.rowsAffected[0]; // Return the number of rows affected
    }

    // Overloaded select method
    async select(query: string, params?: Record<string, any>): Promise<any>;
    async select(sqlFilePath: string): Promise<any>;
    async select(queryOrFile: string, params?: Record<string, any>): Promise<any> {
        const query = await this.getQuery(queryOrFile, params);
        return await this.executeQuery(query, params);
    }

    // Overloaded update method
    async update(query: string, params?: Record<string, any>): Promise<number>;
    async update(sqlFilePath: string): Promise<number>;
    async update(queryOrFile: string, params?: Record<string, any>): Promise<number> {
        const query = await this.getQuery(queryOrFile, params);
        const result = await this.executeQuery(query, params);
        return result.rowsAffected[0]; // Return the number of rows affected
    }

    // Overloaded delete method
    async delete(query: string, params?: Record<string, any>): Promise<number>;
    async delete(sqlFilePath: string): Promise<number>;
    async delete(queryOrFile: string, params?: Record<string, any>): Promise<number> {
        const query = await this.getQuery(queryOrFile, params);
        const result = await this.executeQuery(query, params);
        return result.rowsAffected[0]; // Return the number of rows affected
    }

    // Helper method to get query from a file or use raw query
    private async getQuery(queryOrFile: string, params?: Record<string, any>): Promise<string> {
        if (params) {
            return queryOrFile; // Return the raw query if params are provided
        } else {
            return this.readSQLFile(queryOrFile); // Read from .sql file if no params
        }
    }

    // Helper method to execute query with or without parameters
    private async executeQuery(query: string, params?: Record<string, any>): Promise<sql.IResult<any>> {
        try {
            const request = this.pool.request();

            // Bind parameters if provided
            if (params) {
                for (const key in params) {
                    request.input(key, this.getSqlType(params[key]), params[key]);
                }
            }

            // Execute the query and return the result
            return await request.query(query);
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

    // Helper method to determine SQL type
    private getSqlType(value: any): sql.ISqlType {
        if (typeof value === 'string') {
            return sql.NVarChar as unknown as sql.ISqlType;
        } else if (typeof value === 'number') {
            return Number.isInteger(value) ? (sql.Int as unknown as sql.ISqlType) : (sql.Decimal(10, 2) as unknown as sql.ISqlType);
        } else if (value instanceof Date) {
            return sql.DateTime as unknown as sql.ISqlType;
        } else if (Buffer.isBuffer(value)) {
            return sql.VarBinary as unknown as sql.ISqlType;
        } else {
            throw new Error(`Unsupported type for value: ${value}`);
        }
    }

    async close(): Promise<void> {
        try {
            await this.pool.close();
            console.log('Connection closed');
        } catch (error) {
            console.error('Error closing connection:', error);
        }
    }
}

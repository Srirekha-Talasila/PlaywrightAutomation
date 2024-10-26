import { SQLServerUtility1 } from '../utilities/SQLServer1'; // Adjust the path accordingly
import sql from 'mssql';

// SQL Server configuration
const sqlConfig: sql.config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    database: 'your_database',
    options: {
        encrypt: true, // Use true if you're on Azure
    },
};

// Create an instance of SQLServerUtility
const dbUtility = new SQLServerUtility1(sqlConfig);

async function main() {
    try {
        // 1) Connect to the SQL Server
        await dbUtility.connect();

        // 2) Execute a raw SQL INSERT query with parameters
        const insertRows = await dbUtility.insert(
            'INSERT INTO Employees (FirstName, LastName, Age) VALUES (@firstName, @lastName, @age)', 
            {
                firstName: 'Jane',
                lastName: 'Doe',
                age: 28,
            }
        );
        console.log(`${insertRows} row(s) inserted.`);

        // 3) Execute a raw SQL SELECT query without parameters
        const employees = await dbUtility.select('SELECT * FROM Employees');
        console.log('Employees:', employees);

        // 4) Execute a raw SQL UPDATE query with parameters
        const updatedRows = await dbUtility.update(
            'UPDATE Employees SET Age = @newAge WHERE FirstName = @firstName',
            {
                firstName: 'Jane',
                newAge: 30,
            }
        );
        console.log(`${updatedRows} row(s) updated.`);

        // 5) Execute a raw SQL DELETE query with parameters
        const deletedRows = await dbUtility.delete(
            'DELETE FROM Employees WHERE FirstName = @firstName',
            {
                firstName: 'Jane',
            }
        );
        console.log(`${deletedRows} row(s) deleted.`);

        // 6) Execute SQL statements from a .sql file for insertion
        const insertFromFile = await dbUtility.insert('path/to/insert.sql');
        console.log(`${insertFromFile} row(s) inserted from SQL file.`);

        // 7) Execute SQL statements from a .sql file for deletion
        const deleteFromFile = await dbUtility.delete('path/to/delete.sql');
        console.log(`${deleteFromFile} row(s) deleted from SQL file.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await dbUtility.close();
    }

    // Function to select all employees
async function selectAllEmployees() {
    try {
        const employees = await dbUtility.select('SELECT * FROM Employees');
        console.log('All Employees:', employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

// Function to select employees by last name
async function selectEmployeesByLastName(lastName: string) {
    try {
        const employees = await dbUtility.select(
            'SELECT * FROM Employees WHERE LastName = @lastName',
            { lastName }
        );
        console.log(`Employees with Last Name ${lastName}:`, employees);
    } catch (error) {
        console.error('Error fetching employees by last name:', error);
    }
}

// Function to select employees from a file
async function selectEmployeesFromFile() {
    try {
        const employees = await dbUtility.select('path/to/selectEmployees.sql');
        console.log('Employees from SQL file:', employees);
    } catch (error) {
        console.error('Error fetching employees from file:', error);
    }
}
}

// Run the main function
main().catch(console.error);

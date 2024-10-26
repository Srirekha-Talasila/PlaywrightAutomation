
import { OracleUtility } from "../utilities/OracleDB1";

const oracleConfig = {
    user: 'your_username',
    password: 'your_password',
    connectString: 'your_connection_string',
};

const dbUtility = new OracleUtility(oracleConfig);

async function main() {
    await dbUtility.connect();

    // 1) Execute a raw SQL insert query with parameters
    const rowsInserted = await dbUtility.insert('INSERT INTO Employees (Name, Age) VALUES (:name, :age)', {
        name: 'Jane Doe',
        age: 28,
    });
    console.log(`${rowsInserted} row(s) inserted.`);

    // 2) Execute a raw SQL select query without parameters
    const employees = await dbUtility.select('SELECT * FROM Employees');
    console.log(employees);

    // 3) Execute SQL statements from a .sql file for delete
    const rowsDeleted = await dbUtility.delete('path/to/delete.sql');
    console.log(`${rowsDeleted} row(s) deleted.`);

    await dbUtility.close();
}

main().catch((error) => console.error('Error:', error));

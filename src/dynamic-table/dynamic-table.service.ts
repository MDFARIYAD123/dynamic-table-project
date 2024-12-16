import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DynamicTableService {
    constructor(private dataSource: DataSource) { }

    // Create a Table Dynamically
    async createTable(tableName: string, columns: { name: string; type: string }[]) {
        const columnDefinitions = columns
            .map((col) => `${col.name} ${col.type}`)
            .join(', ');

        const query = `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, ${columnDefinitions});`;
        await this.dataSource.query(query);
        return { message: `Table ${tableName} created successfully.` };
    }


    // Iserting data into table and this allow user to leave some filed and later enter data also

    async insertData(
        tableName: string,
        data: Record<string, any> | Record<string, any>[]
    ) {

        const dataArray = Array.isArray(data) ? data : [data];


        const allColumns = Array.from(
            new Set(dataArray.flatMap((row) => Object.keys(row)))
        );


        const columns = allColumns.join(', ');


        const values = dataArray
            .map((row) =>
                `(${allColumns
                    .map((col) => (row[col] !== undefined ? `'${row[col]}'` : 'NULL'))
                    .join(', ')})`
            )
            .join(', ');


        const query = `INSERT INTO ${tableName} (${columns}) VALUES ${values};`;


        await this.dataSource.query(query);

        return { message: `Data inserted into ${tableName} Table successfully.` };
    }


    // Fetch Data from Table

    async fetchTableData(tableName: string): Promise<any[]> {
        try {
            const query = `SELECT * FROM ${tableName}`;
            return await this.dataSource.query(query);
        } catch (error) {
            if (error.message.includes('does not exist') || error.message.includes('Unknown table')) {
                throw new Error(`Table '${tableName}' does not exist.`);
            }
            throw new Error(`Error fetching data from table '${tableName}': ${error.message}`);
        }
    }


    // Add Column to Table
    async addColumn(tableName: string, columnName: string, columnType: string) {
        const query = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType};`;
        await this.dataSource.query(query);
        return { message: `Column ${columnName} added to ${tableName}.` };
    }


    // Upddate Any Column Value
    async updateColumnForId(
        tableName: string,
        id: number,
        columnName: string,
        value: any
    ): Promise<string> {
        try {
            // Step 1: Construct the dynamic SQL query
            const updateQuery = `UPDATE ${tableName} SET ${columnName} = $1 WHERE id = $2 RETURNING id`;

            // Step 2: Execute the query with parameterized inputs
            const result = await this.dataSource.query(updateQuery, [value, id]);

            // Step 3: Log the result for debugging
            console.log('Query result:', result);

            // Step 4: Check if a row was updated
            if (result && result.length > 0) {
                return `Column '${columnName}' updated successfully for row with id ${id}.`;
            } else {
                return `Row with id ${id} does not exist or no changes made.`;
            }
        } catch (error) {
            // Log the error for debugging
            console.error(`Error while updating column '${columnName}': ${error.message}`);

            // Step 5: Throw an error if something goes wrong
            throw new Error(`Error updating column '${columnName}' for id ${id}: ${error.message}`);
        }
    }














































































































    // Delete Column from Table
    async deleteColumn(tableName: string, columnName: string) {
        const query = `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${columnName};`;
        await this.dataSource.query(query);
        return { message: `Column ${columnName} deleted from ${tableName}.` };
    }



    //Delete row with id if exist else say row with this id does not exist


    async deleteRowsById(tableName: string, id: number): Promise<string> {
        try {
            console.log(`Checking existence of row with id ${id} in table ${tableName}`);


            const checkQuery = `SELECT 1 FROM ${tableName} WHERE id = $1 LIMIT 1`;
            const checkResult = await this.dataSource.query(checkQuery, [id]);

            console.log(`Row check result:`, checkResult);
            if (!checkResult || checkResult.length === 0) {
                return `Row with id '${id}' does not exist.`;
            }


            const deleteQuery = `DELETE FROM ${tableName} WHERE id = $1 RETURNING id`;
            console.log(`Executing delete query: ${deleteQuery} with id ${id}`);

            const deleteResult = await this.dataSource.query(deleteQuery, [id]);

            console.log(`Delete result:`, deleteResult);


            if (deleteResult && deleteResult.length > 0) {
                return `Row with id '${id}' deleted successfully.`;
            }


            return `Failed to delete row with id '${id}'.`;
        } catch (error) {

            throw new Error(`Error deleting row with id '${id}': ${error.message}`);
        }
    }


    // Delete Table
    async deleteTable(tableName: string) {
        const query = `DROP TABLE IF EXISTS ${tableName};`;
        await this.dataSource.query(query);
        return { message: `Table ${tableName} deleted successfully.` };
    }
}
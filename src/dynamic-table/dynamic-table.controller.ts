
import { Controller, Post, Body, Get, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { DynamicTableService } from './dynamic-table.service';

@Controller('dynamic-table')
export class DynamicTableController {
    constructor(private readonly dynamicTableService: DynamicTableService) { }

    // Create Table
    @Post('create')
    async createTable(
        @Body() createTableDto: { tableName: string; columns: { name: string; type: string }[] },
    ) {
        return this.dynamicTableService.createTable(createTableDto.tableName, createTableDto.columns);
    }


    // Insert data
    @Post('insert/:tableName')
    async insertData(
        @Param('tableName') tableName: string,
        @Body() data: Record<string, any>[],
    ) {
        return this.dynamicTableService.insertData(tableName, data);
    }


    //NEW FEATURE TESTING
    // Fetch Data from Table

    @Get('fetch/:tableName')
    async fetchTableData(@Param('tableName') tableName: string): Promise<any> {
        try {
            return await this.dynamicTableService.fetchTableData(tableName);
        } catch (error) {
            if (error.message.includes('does not exist')) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            throw new HttpException(
                `Error fetching data: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }



    // Add Column to Table
    @Post('add-column/:tableName')
    async addColumn(
        @Param('tableName') tableName: string,
        @Body() columnDto: { columnName: string; columnType: string },
    ) {
        return this.dynamicTableService.addColumn(tableName, columnDto.columnName, columnDto.columnType);
    }


    // Add Value to Any Column

    @Put('update-column/:tableName')
    async updateColumn(
        @Param('tableName') tableName: string,
        @Body() body: { id: number; columnName: string; value: any }
    ): Promise<any> {
        const { id, columnName, value } = body;

        // Step 1: Validate the input data
        if (!id || !columnName || value === undefined) {
            return {
                success: false,
                message: 'Invalid input: id, columnName, and value are required.'
            };
        }

        // Step 2: Call the service to update the column
        try {
            // Log input values for debugging
            console.log(`Attempting to update column '${columnName}' with value '${value}' for row with id ${id} in table ${tableName}`);

            // Call the service method to update the column
            const message = await this.dynamicTableService.updateColumnForId(tableName, id, columnName, value);

            // Return success message
            return { success: true, message };
        } catch (error) {
            // Log the error for debugging
            console.error(`Error in updating column: ${error.message}`);

            // Return error message
            return { success: false, message: `Error: ${error.message}` };
        }
    }



































































    // Delete Column from Table
    @Post('delete-column/:tableName')
    async deleteColumn(
        @Param('tableName') tableName: string,
        @Body() columnDto: { columnName: string },
    ) {
        return this.dynamicTableService.deleteColumn(tableName, columnDto.columnName);
    }


    // Delete row with given id if exist or else say row with this id does not exist


    @Post('delete-rows/:tableName')
    async deleteRows(
        @Param('tableName') tableName: string,
        @Body() body: { id: number }
    ): Promise<any> {
        const { id } = body;

        try {
            const message = await this.dynamicTableService.deleteRowsById(tableName, id);
            if (message.includes("does not exist")) {
                return { success: false, message };
            }
            return { success: true, message };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    }





















    // Delete Table
    @Post('delete/:tableName')
    async deleteTable(@Param('tableName') tableName: string) {
        return this.dynamicTableService.deleteTable(tableName);
    }
}
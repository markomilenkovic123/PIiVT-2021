import IModel from "../common/IModel.interface";
import * as mysql2 from "mysql2/promise";
import IModelAdapterOptions from "../common/IModelAdapterOptions.interface";
import IErrorResponse from "../common/IErrorResponse.interface";

export default abstract class BaseService<ReturnModel extends IModel> {
    private dbConnection: mysql2.Connection;

    constructor(db: mysql2.Connection) {
        this.dbConnection = db;
    }

    protected get db(): mysql2.Connection {
        return this.dbConnection;
    }

    protected abstract adaptModel(row: any, options: Partial<IModelAdapterOptions>): Promise<ReturnModel>;

    protected async getAllFromTable(
        tableName: string, 
        options: Partial<IModelAdapterOptions> = {
            loadParent: false,
            loadChildren: false,
        }
    ): Promise<ReturnModel[] | IErrorResponse> {
        return new Promise<ReturnModel[]|IErrorResponse>(async (resolve) => {
            const sql: string = `SELECT * FROM ${tableName};`
            this.db.execute(sql)
                .then(async ([rows, columns]) => {
                    const lista: ReturnModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(await this.adaptModel(row, options))
                        }
                    }
                    resolve(lista);
                })
                .catch((error) => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
            
            
        });
    }

    protected async getByIdFromTable(
        tableName: string,
        id: number,
        options: Partial<IModelAdapterOptions> = {
            loadChildren: true,
            loadParent: true,
        }
    ): Promise<ReturnModel|null|IErrorResponse> {
        try {
            const sql: string = `SELECT * FROM ${tableName} WHERE ${tableName}_id = ?;`;
            const [rows, columns] = await this.db.execute(sql, [id])
            
            if (!Array.isArray(rows)) {
                return null;
            }

            if (rows.length === 0) {
                return null;
            }

            return await this.adaptModel(rows[0], options);
        } catch (error) {
            return {
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }
        }
    }

    protected async getAllByFieldName(
        tableName: string, 
        fieldName: string, 
        fieldValue: any, 
        options: Partial<IModelAdapterOptions> = {
            loadParent: false,
            loadChildren: false,
        }
    ): Promise<ReturnModel[]|IErrorResponse> {
        return new Promise<ReturnModel[]|IErrorResponse>(async (resolve) => {
            let sql: string = `SELECT * FROM ${tableName} WHERE ${fieldName} = ?;`

            if (fieldValue === null) {
                sql = `SELECT * FROM ${tableName} WHERE ${fieldName} is NULL;`
            }
            
            this.db.execute(sql, [fieldValue])
                .then(async ([rows, columns]) => {
                    const lista: ReturnModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(await this.adaptModel(row, options))
                        }
                    }
                    resolve(lista);
                })
                .catch((error) => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
            
            
        });
    }
}
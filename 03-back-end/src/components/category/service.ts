import CategoryModel from "./model";
import * as mysql2 from "mysql2/promise";
import { raw } from "express";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddCategory } from "./dto/AddCategory";
import { resolve } from "path/posix";

class CategoryService {
    private db: mysql2.Connection;

    constructor(db: mysql2.Connection) {
        this.db = db;
    }

    protected async adaptModel(row: any, options: Partial<IModelAdapterOptions> = { loadChildren: false, loadParent: false }): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();
        item.categoryId = row?.category_id;
        item.name = row?.name;
        item.description = row?.description;
        item.imagePath = row?.image_path;

        if (options.loadParent) {
            
        }

        if (options.loadChildren) {
            
        }

        return item;

    }

    public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
        return new Promise<CategoryModel[]|IErrorResponse>(async (resolve) => {
            const sql: string = "SELECT * FROM category;"
            this.db.execute(sql)
                .then(async ([rows, columns]) => {
                    const lista: CategoryModel[] = [];

                    if (Array.isArray(rows)) {
                        for (const row of rows) {
                            lista.push(await this.adaptModel(row))
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

    public async getById(categoryId: number): Promise<CategoryModel|null|IErrorResponse> {
        try {
            const sql: string = "SELECT * FROM category WHERE category_id = ?;"
            const [rows, columns] = await this.db.execute(sql, [categoryId])
            
            if (!Array.isArray(rows)) {
                return null;
            }

            if (rows.length === 0) {
                return null;
            }

            return await this.adaptModel(rows[0] )
        } catch (error) {
            return {
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }
        }
    }

    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql: string = "INSERT category SET name = ?, image_path = ?, description = ?;"
            this.db.execute(sql, [data.name, data.imagePath ?? null, data.description])
                .then(async result => {
                    const insertInfo: any = result[0];
                    const newCategoryId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newCategoryId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                })

        })
    }
}

export default CategoryService;
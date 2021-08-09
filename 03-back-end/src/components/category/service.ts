import CategoryModel from "./model";
import * as mysql2 from "mysql2/promise";
import { raw } from "express";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddCategory } from "./dto/AddCategory";
import { resolve } from "path/posix";
import BaseService from "../../common/BaseService";
import { IEditCategory } from "./dto/EditCategory";

class CategoryModelAdapterOptions implements IModelAdapterOptions {
    loadParentCategory: boolean = false;
    loadSubcategories: boolean = false;
}

class CategoryService extends BaseService<CategoryModel> {
    protected async adaptModel(row: any, options: Partial<CategoryModelAdapterOptions> = {}): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();
        item.categoryId = row?.category_id;
        item.name = row?.name;
        item.description = row?.description;
        item.imagePath = row?.image_path;

        if (options.loadParentCategory) {
            
        }

        if (options.loadSubcategories) {
            
        }

        return item;

    }

    public async getAll(options: Partial<CategoryModelAdapterOptions> = {}): Promise<CategoryModel[]|IErrorResponse> {
        return await this.getAllFromTable<CategoryModelAdapterOptions>("category", options);
    }

    public async getById(categoryId: number, options: Partial<CategoryModelAdapterOptions> = {}): Promise<CategoryModel|null|IErrorResponse> {
        return await this.getByIdFromTable<CategoryModelAdapterOptions>("category", categoryId, options);
    }

    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql: string = "INSERT category SET name = ?, image_path = ?, description = ?;"
            this.db.execute(sql, [data.name, data.imagePath ?? null, data.description])
                .then(async result => {
                    const insertInfo: any = result[0];
                    const newCategoryId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newCategoryId, {}));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });

        });
    }

    public async edit(categoryId: number, data: IEditCategory, options: Partial<CategoryModelAdapterOptions> = {}): Promise<CategoryModel|IErrorResponse|null> {
        const result = await this.getById(categoryId);
        
        if (result === null) {
            return null;
        }

        if (!(result instanceof CategoryModel)) {
            return result;
        }

        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql: string = `
                UPDATE 
                    category 
                SET 
                    name = ?, 
                    image_path = ?, 
                    description = ?
                WHERE
                    category_id = ?;`

            this.db.execute(sql, [data.name, data.imagePath ?? null, data.description, categoryId])
                .then(async result => {
                    resolve(await this.getById(categoryId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });

        });
    }

    public async delete(categoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = `DELETE FROM category WHERE category_id = ?`;
            this.db.execute(sql, [categoryId])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);
                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "One record deleted",
                        });
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record can not be deleted",
                        });
                    }
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    });
                });
        })
    }
}

export default CategoryService;
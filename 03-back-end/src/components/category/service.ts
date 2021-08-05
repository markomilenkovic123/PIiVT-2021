import CategoryModel from "./model";
import * as mysql2 from "mysql2/promise";
import { raw } from "express";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddCategory } from "./dto/AddCategory";
import { resolve } from "path/posix";
import BaseService from "../../services/baseService";
import { IEditCategory } from "./dto/EditCategory";

class CategoryService extends BaseService<CategoryModel> {
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
        return await this.getAllFromTable("category");
    }

    public async getById(categoryId: number): Promise<CategoryModel|null|IErrorResponse> {
        return await this.getByIdFromTable("category", categoryId);
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
                });

        });
    }

    public async edit(categoryId: number, data: IEditCategory): Promise<CategoryModel|IErrorResponse|null> {
        const result = await this.getById(categoryId);
        console.log(result);
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
                    resolve(await this.getById(categoryId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });

        });
    }
}

export default CategoryService;
import CategoryModel from "./model";
import * as mysql2 from "mysql2/promise";
import { raw } from "express";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";

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

        return item;

    }

    public async getAll(): Promise<CategoryModel[]> {
        const lista: CategoryModel[] = [];
        const sql: string = "SELECT * FROM category;"
        const [rows, columns] = await this.db.execute(sql)
        
        if (Array.isArray(rows)) {
            for (const row of rows) {
                lista.push(await this.adaptModel(row))
            }
        }

        return lista;
    }

    public async getById(categoryId: number): Promise<CategoryModel|null> {
        const sql: string = "SELECT * FROM category WHERE category_id = ?;"
        const [rows, columns] = await this.db.execute(sql, [categoryId])
        
        if (!Array.isArray(rows)) {
            return null;
        }

        if (rows.length === 0) {
            return null;
        }

        return await this.adaptModel(rows[0] )
    }
}

export default CategoryService;
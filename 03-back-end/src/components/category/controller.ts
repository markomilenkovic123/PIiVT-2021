import { Request, Response, NextFunction } from "express";
import CategoryModel from "./model";
import CategoryService from "./service"

class CategoryController {
    private categoryService: CategoryService;

    constructor(categryService: CategoryService) {
        this.categoryService = categryService;
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const categories = await this.categoryService.getAll();
        res.send(categories);
    }
}

export default CategoryController

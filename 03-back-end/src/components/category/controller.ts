import { Request, Response, NextFunction } from "express";
import CategoryModel from "./model";
import CategoryService from "./service"

class CategoryController {
    private categoryService: CategoryService;

    constructor(categryService: CategoryService) {
        this.categoryService = categryService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const categories = await this.categoryService.getAll();
        res.send(categories);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id
        const categoryId: number = +id

        if (categoryId <= 0) {
            res.sendStatus(400);
            return;
        }

        const category: CategoryModel|null = await this.categoryService.getById(categoryId);

        if (category === null) {
            res.sendStatus(404);
            return;
        }

        res.send(category);
    }
}

export default CategoryController

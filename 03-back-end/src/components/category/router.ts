import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources';
import CategoryController from './controller';
import CategoryService from './service';

export default class CategoryRouter {
    public static setupRoutes(application: express.Application, resources: IApplicationResources) {
        const categoryService: CategoryService = new CategoryService(resources.databaseConnection);
        const categoryController: CategoryController = new CategoryController(categoryService);

        application.get("/category", categoryController.getAll.bind(categoryController));
        application.get("/category/:id", categoryController.getById.bind(categoryController));
    }
}
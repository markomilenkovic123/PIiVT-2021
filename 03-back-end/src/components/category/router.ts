import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import CategoryController from './controller';
import CategoryService from './service';

export default class CategoryRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const categoryService: CategoryService = new CategoryService(resources.databaseConnection);
        const categoryController: CategoryController = new CategoryController(categoryService);

        application.get("/category", categoryController.getAll.bind(categoryController));
        application.get("/category/:id", categoryController.getById.bind(categoryController));
        application.post("/category/", categoryController.add.bind(categoryController));
        application.put("/category/:id", categoryController.edit.bind(categoryController));
        application.delete("/category/:id", categoryController.deleteById.bind(categoryController));
    }
}
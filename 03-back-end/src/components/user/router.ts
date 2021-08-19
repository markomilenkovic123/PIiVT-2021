import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import UserController from './controller';
import CategoryController from './controller';
import CategoryService from './service';

export default class UserRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const userController: UserController = new UserController(resources);

        application.get("/user", userController.getAll.bind(userController));
        application.get("/user/:id", userController.getById.bind(userController));
        application.post("/user/", userController.add.bind(userController));
        application.put("/user/:id", userController.edit.bind(userController));
        application.delete("/user/:id", userController.delete.bind(userController));
    }
}
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import ManufacturerController from './controller';
import ManufacturerService from './service';

export default class ManufacturerRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const manufacturerController: ManufacturerController = new ManufacturerController(resources);

        application.get(
                "/manufacturer", 
                AuthMiddleware.getVerifier("user","administrator"),
                manufacturerController.getAll.bind(manufacturerController)
            );
        application.get(
                "/manufacturer/:id", 
                AuthMiddleware.getVerifier("user", "administrator"),
                manufacturerController.getById.bind(manufacturerController)
            );
        application.post(
            "/manufacturer/",
            AuthMiddleware.getVerifier("administrator"), 
            manufacturerController.add.bind(manufacturerController)
            );
        application.put(
                "/manufacturer/:id", 
                AuthMiddleware.getVerifier("administrator"), 
                manufacturerController.edit.bind(manufacturerController)
            );
        application.delete(
                "/manufacturer/:id", 
                AuthMiddleware.getVerifier("administrator"), 
                manufacturerController.deleteById.bind(manufacturerController)
            );
    }
}
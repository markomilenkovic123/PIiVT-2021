import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import ManufacturerController from './controller';
import ManufacturerService from './service';

export default class ManufacturerRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const manufacturerController: ManufacturerController = new ManufacturerController(resources);

        application.get("/manufacturer", manufacturerController.getAll.bind(manufacturerController));
        application.get("/manufacturer/:id", manufacturerController.getById.bind(manufacturerController));
        application.post("/manufacturer/", manufacturerController.add.bind(manufacturerController));
        application.put("/manufacturer/:id", manufacturerController.edit.bind(manufacturerController));
        application.delete("/manufacturer/:id", manufacturerController.deleteById.bind(manufacturerController));
    }
}
import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import ProfileController from './controller';

export default class ProfileRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const profileController: ProfileController = new ProfileController(resources);

        application.get("/profile", profileController.getAll.bind(profileController));
        application.get("/profile/:id", profileController.getById.bind(profileController));
        application.post("/profile/", profileController.add.bind(profileController));
        application.put("/profile/:id", profileController.edit.bind(profileController));
        application.delete("/profile/:id", profileController.delete.bind(profileController));
        application.delete("/profile/:aid/photo/pid", profileController.deleteProfilePhoto.bind(profileController));
        application.post("/profile/:id/photo", profileController.addProfilePhotos.bind(profileController));
    }
}
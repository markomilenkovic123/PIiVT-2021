import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import ProfileController from './controller';

export default class ProfileRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const profileController: ProfileController = new ProfileController(resources);

        application.get(
                "/profile",
                AuthMiddleware.getVerifier("user", "administrator"), 
                profileController.getAll.bind(profileController)
            );
        application.get(
            "/profile/:id", 
            AuthMiddleware.getVerifier("user", "administrator"),
            profileController.getById.bind(profileController)
            );
        application.post(
                "/profile/",
                AuthMiddleware.getVerifier("administrator"), 
                profileController.add.bind(profileController)
            );
        application.put(
                "/profile/:id",
                AuthMiddleware.getVerifier("administrator"), 
                profileController.edit.bind(profileController)
             );
        application.delete(
                "/profile/:id",
                AuthMiddleware.getVerifier("administrator"), 
                profileController.delete.bind(profileController)
             );
        application.delete(
                "/profile/:aid/photo/:pid",
                AuthMiddleware.getVerifier("administrator"), 
                profileController.deleteProfilePhoto.bind(profileController)
             );
        application.post(
                "/profile/:id/photo",
                AuthMiddleware.getVerifier("administrator"), 
                profileController.addProfilePhotos.bind(profileController)
             );
    }
}
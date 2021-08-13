import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import { IAddProfile, IAddProfileValidator, IUploadPhoto } from "./dto/AddProfile";
import ProfileModel from "./model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import Config from "../../config/dev";
import {v4} from "uuid";

class  ProfileController extends BaseController {

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const profiles = await this.services.profileServices.getAll();
        res.send(profiles);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id
        const profileId: number = +id;

        if (profileId <= 0) {
            res.sendStatus(400);
            return;
        }

        const data: ProfileModel|null|IErrorResponse = await this.services.profileServices.getById(profileId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof ProfileModel) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload at least 1 and maximum of " + Config.fileUpload.maxFiles + " photos")
            return;
        }

        const fileKeys: string[] = Object.keys(req.files);

        const uploadedPhotos: IUploadPhoto[] = [];

        for (const fileKey of fileKeys) {
            const file = req.files[fileKey] as any;
            const randomString = v4();
            const originalName = file?.name;
            const now = new Date();

            const imagePath = Config.fileUpload.uploadDestinationDirectory + 
                (Config.fileUpload.uploadDestinationDirectory.endsWith("/") ? "" : "/") +
                now.getFullYear() + "/" + 
                ((now.getMonth() + 1) + "").padEnd(2, "0") + "/" +
                randomString + originalName;

            await file.mv(imagePath);
            uploadedPhotos.push({
                imagePath: imagePath,
            });
        }

        const data = JSON.parse(req.body?.data);

        if (!IAddProfileValidator(data)) {
            res.status(400).send(IAddProfileValidator.errors);
            return;
        }

        const result =  await this.services.profileServices.add(data as IAddProfile, uploadedPhotos);

        res.send(result);
    }
}

export default ProfileController;
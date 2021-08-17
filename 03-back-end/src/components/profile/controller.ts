import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import { IAddProfile, IAddProfileValidator, IUploadPhoto } from "./dto/AddProfile";
import ProfileModel from "./model";
import IErrorResponse from "../../common/IErrorResponse.interface";
import Config from "../../config/dev";
import {v4} from "uuid";
import { UploadedFile } from "express-fileupload";
import sizeOf from "image-size";

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

    private isPhotoValid(file: UploadedFile): { isOk: boolean; message?: string; } {
        const size = sizeOf(file.tempFilePath);
        const limits = Config.fileUpload.photos.limits

        if (size.width < limits.minWidth) {
            return {
                isOk: false,
                message: "The image must have a width of at least " + limits.minWidth + "px",
            }
        }
        if (size.height < limits.minHeight) {
            return {
                isOk: false,
                message: "The image must have a height of at least " + limits.minHeight + "px",
            }
        }
        if (size.width > limits.maxWidth) {
            return {
                isOk: false,
                message: "The image must have a width of maximum " + limits.maxWidth + "px",
            }
        }
        if (size.height > limits.maxHeight) {
            return {
                isOk: false,
                message: "The image must have a height of maximum " + limits.maxHeight + "px",
            }
        }

        return {
            isOk:true
        }
    }

    private async uploadFiles(req: Request, res: Response,): Promise<IUploadPhoto[]> {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload at least 1 and maximum of " + Config.fileUpload.maxFiles + " photos")
            return [];
        }

        const fileKeys: string[] = Object.keys(req.files);

        const uploadedPhotos: IUploadPhoto[] = [];

        for (const fileKey of fileKeys) {
            const file = req.files[fileKey] as any;

            const result = this.isPhotoValid(file)
            if (result.isOk === false) {
                res.status(400).send(`error with image key ${fileKey}: ${result.message}`);
                return [];
            }

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

        return uploadedPhotos;
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const uploadedPhotos = await this.uploadFiles(req, res);

        if (uploadedPhotos.length === 0) {
            return;
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
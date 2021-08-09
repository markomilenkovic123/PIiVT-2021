import { Request, Response, NextFunction } from "express";
import BaseController from "../../common/BaseController";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddManufacturer, IAddManufacturerValidator } from "./dto/AddManufacturer";
import { IEditManufacturer, IEditManufacturerValidator } from "./dto/EditManufacturer";
import ManufacturerModel from "./model";
import ManufacturerService from "./service";

class ManufacturerController extends BaseController {

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const manufacturers = await this.services.manufacturerService.getAll();
        res.send(manufacturers);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;
        const manufacturerId = +(id);

        if (manufacturerId < 0) {
            res.sendStatus(400);
            return;
        }

        const data: ManufacturerModel|null|IErrorResponse = await this.services.manufacturerService.getById(manufacturerId);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof ManufacturerModel) {
            res.send(data);
            return;
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if(!IAddManufacturerValidator(data)) {
            res.status(400).send(IAddManufacturerValidator.errors);
            return;
        }

        const result = await this.services.manufacturerService.add(data as IAddManufacturer);
        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const manufacturerId = +id;

        if (manufacturerId <= 0) {
            res.status(400).send("Invalid ID number");
            return;
        }
        if (!IEditManufacturerValidator(data)) {
            res.status(400).send(IEditManufacturerValidator.errors);
            return;
        }

        const result = await this.services.manufacturerService.edit(manufacturerId, data as IEditManufacturer);
        if (result === null) {
            res.sendStatus(404);
            return;
        }

        res.send(result);
    }

    async deleteById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const manufacturerId: number = +id;

        if (manufacturerId <= 0) {
            res.sendStatus(400);
            return;
        }

        res.send(await this.services.manufacturerService.deleteById(manufacturerId));
    }
}

export default ManufacturerController;
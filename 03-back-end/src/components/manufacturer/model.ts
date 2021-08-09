import IModel from "../../common/IModel.interface";

class ManufacturerModel implements IModel {
    manufacturerId: number;
    name: string;
    createdAt: Date;
}

export default ManufacturerModel;
import IModel from "../../common/IModel.interface";
import CategoryModel from "../category/model";
import ManufacturerModel from "../manufacturer/model";

class Photo implements IModel {
    photoId: number;
    image_path: string;
}

class ProfileModel implements IModel {
    prifileId: number;
    name: string;
    description: string | null;
    pricePerUnit: number;
    manufacturerId: number;
    manufacturer?: ManufacturerModel;
    categoryId: number;
    category?: CategoryModel;
    status: string; //enum
    createdAt: Date;
    photos: Photo[] = [];
}

export default ProfileModel;
export { Photo as ProfilePhoto };
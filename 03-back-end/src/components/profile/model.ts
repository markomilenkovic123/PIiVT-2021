import IModel from "../../common/IModel.interface";
import CategoryModel from "../category/model";
import ManufacturerModel from "../manufacturer/model";

type ProfileStatus = 'available' | 'visible'  | 'hidden';

class Photo implements IModel {
    photoId: number;
    imagePath: string;
}

class ProfileModel implements IModel {
    profileId: number;
    name: string;
    description: string | null;
    pricePerUnit: number;
    manufacturerId: number;
    manufacturer?: ManufacturerModel;
    categoryId: number;
    category?: CategoryModel;
    status: ProfileStatus;
    createdAt: Date;
    photos: Photo[] = [];
}

export default ProfileModel;
export { Photo as ProfilePhoto };
export { ProfileStatus }
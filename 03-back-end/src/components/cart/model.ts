import IModel from "../../common/IModel.interface";
import ProfileModel from "../profile/model";
import UserModel from "../user/model";

class CartProfileModel implements IModel {
    cartProfileId: number;
    quantity: number;
    profileId: number;
    profileModel: ProfileModel;
    height: number;
    width: number;
}

class OrderModel implements IModel {
    orderId: number;
    firstName: string;
    lastName: string;
    address: string;
    createdAt: Date;
}

export default class CartModel implements IModel {
    cartId: number;
    userId: number;
    createdAt: Date;
    user: UserModel;
    profiles: CartProfileModel[] = [];
    order?: OrderModel = null;
}

export { CartModel };
export { OrderModel };
export { CartProfileModel };

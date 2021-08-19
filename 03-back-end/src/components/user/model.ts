import IModel from "../../common/IModel.interface";

class UserModel implements IModel {
    userId: number;
    username: string;
    passwordHash: string;
    createdAt: Date;
}

export default UserModel;
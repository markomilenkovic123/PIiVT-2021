import IModel from "../../common/IModel.interface";

class CategoryModel implements IModel {
    categoryId: number;
    name: string;
    description: string;
    imagePath: string|null;
}

export default CategoryModel;
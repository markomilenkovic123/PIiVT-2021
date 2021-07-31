import CategoryModel from "./model";

class CategoryService {
    public async getAll(): Promise<CategoryModel[]> {
        const lista: CategoryModel[] = [];

        lista.push({
            categoryId:1,
            name: "sa",
            imagePath: "saadsda"
        });
        lista.push({
            categoryId:2,
            name: "sa",
            imagePath: "saadsda"
        });
        
        return lista;
    }
}

export default CategoryService;
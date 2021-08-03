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

    public async getById(categoryId: number): Promise<CategoryModel|null> {
        if (categoryId === 1 || categoryId === 2) {
            if (categoryId === 1) {
                return {
                    categoryId:1,
                    name: "lalslsadlkasldaldsalaldsdall",
                    imagePath: "saadsda"
                }
            }  if (categoryId === 2) {
                return {
                    categoryId:2,
                    name: "sa",
                    imagePath: "saadsda"
                }
            }
        } else {
            return null;
        }
    }
}

export default CategoryService;
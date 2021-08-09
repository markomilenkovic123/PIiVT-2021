import CategoryService from "../components/category/service";
import ManufacturerService from "../components/manufacturer/service";

export default interface IServices {
    categoryService: CategoryService;
    manufacturerService: ManufacturerService;
}
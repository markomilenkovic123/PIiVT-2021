import AdministratorSecvice from "../components/administrator/service";
import CategoryService from "../components/category/service";
import ManufacturerService from "../components/manufacturer/service";
import ProfileService from "../components/profile/service";

export default interface IServices {
    categoryService: CategoryService;
    manufacturerService: ManufacturerService;
    administratorService: AdministratorSecvice;
    profileServices: ProfileService;
}
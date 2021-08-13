import BaseService from "../../common/BaseService";
import ProfileModel from "./model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddProfile, IUploadPhoto } from "./dto/AddProfile";

class ProfileModelAdapterOptions implements IModelAdapterOptions {
    loadCategory: boolean = false;
    loadManufacturer: boolean = false;
    loadPhotos: boolean = false;
}

class ProfileService extends BaseService<ProfileModel> {
    protected async adaptModel(data: any, options: Partial<ProfileModelAdapterOptions> = {}): Promise<ProfileModel> {
        const item: ProfileModel = new ProfileModel();

        item.prifileId = +(data?.profile_id);
        item.name = data?.name;
        item.description = data?.description;
        item.pricePerUnit = +(data?.price_per_unit);
        item.manufacturerId = +(data?.manufacturer_id);
        item.categoryId = +(data?.category_id);
        item.status = data?.status;
        item.createdAt = new Date(data?.created_at);

        item.category = null;
        item.manufacturer = null;
        item.photos = [];

        return item;
    }

    public async getAll(): Promise<ProfileModel[] | IErrorResponse> {
        return await this.getAllFromTable("profile");
    }

    public async getById(profileId: number, options: Partial<ProfileModelAdapterOptions> = {}): Promise<ProfileModel | null | IErrorResponse> {
        return await this.getByIdFromTable("profile", profileId);
    }

    public async add(data: IAddProfile, uploadPhotos: IUploadPhoto[]): Promise<ProfileModel | IErrorResponse> {
        return new Promise<ProfileModel | IErrorResponse>(async resolve => {
            this.db.beginTransaction()
                .then(() => {
                    const sql: string = `
                                    INSERT
                                        profile
                                    SET
                                    name = ?,
                                    description = ?,
                                    price_per_unit_area = ?,
                                    manufacturer_id = ?,
                                    category_id = ?,
                                    status = ?;    
                                    `
                    this.db.execute(sql, [
                        data.name,
                        data.description,
                        data.pricePerUnit,
                        data.manufacturerId,
                        data.categoryId,
                        data.status,
                    ]).then(async (res: any) => {
                        const newProfileID: number = +((res[0] as any)?.insertId);

                        const promises = [];

                        for (const uploadPhoto of uploadPhotos) {
                            promises.push(
                                this.db.execute(
                                    `INSERT photo SET profile_id = ?, image_path = ?;`,
                                    [newProfileID, uploadPhoto.imagePath,]
                                ),
                            );
                        }



                        Promise.all(promises)
                            .then(async () => {
                                await this.db.commit();
                                resolve(await this.services.profileServices.getById(newProfileID, {
                                    loadCategory: true,
                                    loadManufacturer: true,
                                    loadPhotos: true,
                                }))
                            })
                            .catch(async error => {
                                await this.db.rollback();
                                resolve({
                                    errorCode: error?.errno,
                                    errorMessage: error?.sqlMessage
                                })
                            })
                    });
                })
            })
    }
}


export default  ProfileService;
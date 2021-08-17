import BaseService from "../../common/BaseService";
import ProfileModel from "./model";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddProfile, IUploadPhoto } from "./dto/AddProfile";
import { IEditProfile } from "./dto/EditProfile";
import * as fs from "fs";
import * as path from "path";
import Config from "../../config/dev";

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

    public async edit(profileId: number, data: IEditProfile): Promise<ProfileModel|null|IErrorResponse> {
        return new Promise<ProfileModel|null|IErrorResponse>(async resolve => {
            const currentProfile = await this.getById(profileId,{});

            if (currentProfile === null) {
                resolve(null);
                return;
            }

            const rollbackAndResolve = async (error) => {
                await this.db.rollback();
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage,
                });
            }

            this.db.beginTransaction()
                .then(async () => {
                    const sql: string = `
                                        UPDATE
                                            profile
                                        SET 
                                            name = ?,
                                            description = ?,
                                            price_per_unit_area = ?,
                                            status = ? 
                                        WHERE
                                            profile_id = ?
                                        `;

                    await this.db.execute(
                        sql,
                        [
                            data.name,
                            data.description,
                            data.pricePerUnit,
                            data.status,
                            profileId,
                        ]
                    )
                    .catch((error) => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Part 1: " + error?.sqlMessage,
                        });
                    })
                })
                .then(async () => {
                    resolve(await this.getById(profileId,{}));
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                })
        });
    }

    public async delete(profileId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse|null>(async resolve => {
            const currentProfile = await this.getById(profileId,{
                loadPhotos: true,
            });

            if (currentProfile === null) {
                resolve(null);
                return;
            }

            this.db.beginTransaction()
                .then(async () => {
                    if (await this.deleteProfileCart(profileId)) {
                        return;
                    }

                    throw {
                        errno: -1002,
                        sqlMessage: "Could not delete profile cart records",
                    }
                })
                .then(async () => {
                    const filesToDelete = await this.deletePhotosRecord(profileId)
                    if (filesToDelete.length !== 0) {
                        return filesToDelete;
                    }

                    throw {
                        errno: -1003,
                        sqlMessage: "Could not delete profile photo record",
                    }
                })
                .then(async (filesToDelete) => {
                    if (await this.deleteProfileRecords(profileId)) return filesToDelete;
                    throw {
                        errno: -1004,
                        sqlMessage: "Could not delete profile record",
                    }
                })
                .then(async (filesToDelete) => {
                    await this.db.commit();
                    return filesToDelete;
                })
                .then(async (filesToDelete) => {
                    this.deleteProfilePhotosAndResizedVersions(filesToDelete);
                })
                .then(() => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "Profile deleted"
                    })
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                })

        })
    }

    private async deleteProfileCart(profileId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM cart_profile where profile_id = ?;`,
                [profileId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
    }
    private async deletePhotosRecord(profileId: number): Promise<string[]> {
        return new Promise<string[]>(async resolve => {
            const [rows] = await this.db.execute(
                `SELECT image_path FROM photo WHERE profile_id = ?`,
                [profileId]
            );

            if (!Array.isArray(rows) || rows.length === 0) {
                return resolve([]);
            }

            const filesToDelete = rows.map(row => row?.image_path);

            this.db.execute(
                `DELETE FROM photo WHERE profile_id = ?`,
                [profileId]
            )
            .then(() => resolve(filesToDelete))
            .catch(() => resolve([]))

            resolve(filesToDelete)
        })
    }
    private async deleteProfileRecords(profileId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM profile where profile_id = ?;`,
                [profileId]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false))
        })
    }
    private deleteProfilePhotosAndResizedVersions(filesToDelete: string[]) {
        try {
            for (const file of filesToDelete) {
                fs.unlinkSync(file);
                const pathPaths = path.parse(file);

                const directory = pathPaths.dir;
                const filename = pathPaths.name;
                const extensions = pathPaths.ext;

                for (const resizeSpecification of Config.fileUpload.photos.resizes) {
                    const resizedImagePath = directory + "/" +
                                            filename + 
                                            resizeSpecification.sufix + 
                                            extensions;
                    
                    fs.unlinkSync(resizedImagePath);
                }
            }
        } catch (e) {
            
        }
    }
}


export default  ProfileService;
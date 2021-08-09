import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import BaseService from "../../services/BaseService";
import { IAddManufacturer } from "./dto/AddManufacturer";
import { IEditManufacturer } from "./dto/EditManufacturer";
import ManufacturerModel from "./model";

class ManufacturerModelAdapterOptions implements IModelAdapterOptions {

}

class ManufacturerService extends BaseService<ManufacturerModel> {
    protected async adaptModel( data: any, options: Partial<ManufacturerModelAdapterOptions> = {}): Promise<ManufacturerModel> {
        const item: ManufacturerModel = new ManufacturerModel();
        item.manufacturerId = +(data?.manufacturer_id);
        item.name = data?.name;
        
        return item;
    }

    public async getAll(options: Partial<ManufacturerModelAdapterOptions> = {}): Promise<ManufacturerModel[]|IErrorResponse>{
        return await this.getAllFromTable("manufacturer", options);
    }

    public async getById(manufacturerId: number, options: Partial<ManufacturerModelAdapterOptions> = {}): Promise<ManufacturerModel|null|IErrorResponse> {
        return await this.getByIdFromTable<ManufacturerModelAdapterOptions>("manufacturer", manufacturerId, options);
    }

    public async add(data: IAddManufacturer): Promise<ManufacturerModel|IErrorResponse> {
        return new Promise(resolve => {
            const sql: string = "INSERT manufacturer SET name = ?;"
            this.db.execute(sql, [data.name])
                .then(async result => {
                    const insertInfo: any = result[0];
                    const newManufacturerId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newManufacturerId, {}));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
        })
    }

    public async edit(manufacturerId: number, data: IEditManufacturer, options: Partial<ManufacturerModelAdapterOptions> = {}): Promise<ManufacturerModel|null|IErrorResponse> {
        const result = await this.getById(manufacturerId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof ManufacturerModel)) {
            return result;
        }
        
        return new Promise(resolve => {
            const sql: string = `
                UPDATE 
                    manufacturer 
                SET 
                    name = ?
                WHERE
                    manufacturer_id = ?;`
            this.db.execute(sql, [data.name, manufacturerId])
            .then(async result => {
                resolve(await this.getById(manufacturerId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async deleteById(manufacturerId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = `DELETE FROM manufacturer WHERE manufacturer_id = ?`;
            this.db.execute(sql, [manufacturerId])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);
                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "One record deleted",
                        });
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record can not be deleted",
                        });
                    }
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage,
                    });
                });
        })
    }
}

export default ManufacturerService;
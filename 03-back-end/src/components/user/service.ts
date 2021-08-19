import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import UserModel from "./model";
import * as bcrypt from 'bcrypt';
import { IAddUser } from "./dto/AddUser";
import { IEditUser } from "./dto/EditUser";

class UserModelAdapterOptions implements IModelAdapterOptions {
    loadOrders: false;
}

class UserService extends BaseService<UserModel> {
    protected async adaptModel(data: any, options: Partial<UserModelAdapterOptions> = {}): Promise<UserModel> {
        const item = new UserModel();

        item.userId = data?.user_id;
        item.username = data?.username;
        item.passwordHash = data?.password_hash;
        item.createdAt = new Date(data?.created_at);
        item.email = data?.email;

        if (options.loadOrders) {
            
        }

        return item;
    }

    public async getAll(): Promise<UserModel[]|IErrorResponse> {
        return await this.getAllFromTable("user");
    }

    public async getById(userId: number): Promise<UserModel|null|IErrorResponse> {
        return await this.getByIdFromTable("user", userId);
    }

    public async add(data: IAddUser): Promise<UserModel|IErrorResponse> {
        return new Promise<UserModel|IErrorResponse>(async resolve => {
            const passwordHash = bcrypt.hashSync(data.password, 11)

            const sql: string = "INSERT user SET username = ?, password_hash = ?, email = ?;"
            this.db.execute(sql, [data.username, passwordHash, data.email])
                .then(async res => {
                    const newUserId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newUserId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
        });
    }

    public async edit(userId: number,  data: IEditUser): Promise<UserModel|null|IErrorResponse> {
        const result = await this.getById(userId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof UserModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const passwordHash = bcrypt.hashSync(data.password, 11);

            const sql: string = `
                UPDATE 
                    user 
                SET 
                    username = ?,
                    password_hash = ?,
                    email = ?,
                WHERE
                    user_id = ?;`
            this.db.execute(sql, [data.username, passwordHash, data.email, userId])
            .then(async result => {
                resolve(await this.getById(userId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(userId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `DELETE FROM user WHERE user_id = ?;`,
                [
                    userId
                ]
            )
            .then(res => {
                resolve({
                    errorCode: 0,
                    errorMessage: `Deleted ${(res as any[])[0]?.affectedRows} records.`
                });
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        })
    }
}

export default UserService;
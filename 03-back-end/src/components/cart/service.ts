import { Console } from "console";
import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import ProfileModel from "../profile/model";
import UserModel from "../user/model";
import CartModel, { CartProfileModel, OrderModel } from "./model";

class CartModelAdapterOptions implements IModelAdapterOptions {
    loadUser: boolean = false;
    loadProfiles: boolean = false;
    loadOrder: boolean = false
}

export default class CartService extends BaseService<CartModel> {
    protected async adaptModel(data: any, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel> {
        const item = new CartModel();

        item.cartId = +(data?.cart_id);
        item.createdAt = new Date(data?.created_at);
        item.userId = +(data?.user_id);
        
        if (options.loadUser) {
            item.user = await this.services.userService.getById(item.userId) as UserModel;
        }

        if (options.loadOrder) {
            item.order = await this.getOrderByCartId(item.cartId);
        }

        if (options.loadProfiles) {
            item.profiles = await this.getAllCartProfilesByCartId(item.cartId);
        }

        return item;
    }

    private async getOrderByCartId(cartId: number): Promise<OrderModel|null> {
        const [rows] = await this.db.execute(
            `SELECT * FROM \`order\` WHERE cart_id = ?;`,
            [cartId]
        );

        if (!Array.isArray(rows) ||rows.length === 0) {
            return null;
        }

        const order = rows[0] as any;

        return {
            orderId: +(order?.order_id),
            firstName: order.first_name,
            lastName: order.last_name,
            address: order.address,
            createdAt: new Date(order.created_at),
        }
    }
    private async getAllCartProfilesByCartId(cartId: number): Promise<CartProfileModel[]> {
        const [rows] = await this.db.execute(
            `SELECT * FROM cart_profile WHERE cart_id = ?;`,
            [cartId]
        );

        if (!Array.isArray(rows) ||rows.length === 0) {
            return [];
        }

        const items: CartProfileModel[] = [];

        for (const row of rows) {
            const data = row as any

            items.push({
                cartProfileId: +(data?.cart_profile_id),
                quantity: +(data?.quantity),
                profileId: +(data?.profile_id),
                height: +(data?.height),
                width: +(data?.width),
                profileModel: await this.services.profileServices.getById(+(data?.profile_id), {
                    loadManufacturer: true,
                    loadCategory: true,
                    loadPhotos: true,
                }) as ProfileModel
            });
        }

        return items;
    }

    public async getById(cartId: number, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel|IErrorResponse|null> {
        return await super.getByIdFromTable("cart", cartId, options);
    }

    private async add(userId: number): Promise<CartModel|IErrorResponse> {
        return new Promise<CartModel|IErrorResponse>(async resolve => {
            this.db.execute(
                `INSERT cart SET user_id = ?`,
                [userId]
            )
            .then(async res => {
                const newCartId: number = +((res as any[])[0]?.insertId);
                resolve( await this.getById(newCartId, {loadUser: true}) );
            })
            .catch(err => {
                resolve({
                    errorCode: err?.errno,
                    errorMessage: err?.sqlMessage,
                })
            })
        })
    }

    public async getAllCartsByUserId(userId: number, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel[]> {
        return await super.getAllByFieldName<CartModelAdapterOptions>("cart", "user_id", userId, options) as CartModel[];
    }

    public async getLatestCartByUserId(userId: number, options: Partial<CartModelAdapterOptions> = {}): Promise<CartModel> {
        const [ rows ] = await this.db.execute(
            `SELECT
                cart.*
            FROM
                cart
            LEFT JOIN \`order\` ON \`order\`.cart_id = cart.cart_id
            WHERE
                cart.user_id = ?
                AND \`order\`.order_id IS NULL
            ORDER BY
                cart.created_at DESC
            LIMIT 1;`,
            [ userId, ]
        )

        if (!Array.isArray(rows) || rows.length === 0) {
            return await this.add(userId) as CartModel;
        }

        const cartId: number = +((rows as any[])[0]?.cart_id);

        return await this.getById(cartId, {
            loadUser: true,
            loadProfiles: true,
        }) as CartModel;
    }

    public async addProfileToLatestCartByUserId(
        userId: number, 
        profileId: number, 
        quantity: number, 
        height: number, 
        width: number
    ): Promise<CartModel> {
        const cart = await this.getLatestCartByUserId(userId, {loadProfiles: true});

        const filteredProfiles =        cart.profiles.filter(a => a.profileId === profileId);
        const filteredProfileHeights =  cart.profiles.filter(a => a.height === height);
        const filteredProfileWidths =   cart.profiles.filter(a => a.width === width);


        if (filteredProfiles.length >= 1 && filteredProfileHeights.length >= 1 && filteredProfileWidths.length >= 1) {
            await this.db.execute(
                `UPDATE
                    cart_profile
                SET
                    quantity = quantity + ?
                WHERE
                    cart_id = ?
                    AND profile_id = ?
                    AND height = ?
                    AND width = ?;`,
                [
                    quantity,
                    cart.cartId,
                    profileId,
                    height,
                    width,
                ]
            );
        } else {
            await this.db.execute(
                `INSERT cart_profile SET quantity = ?, cart_id = ?, profile_id = ?, height = ?, width = ?`,
                [
                    quantity,
                    cart.cartId,
                    profileId,
                    height,
                    width,
                ]
            );
        }

        return await this.getById(cart.cartId, {loadProfiles: true}) as CartModel;
    }

    public async setProfileToLatestCartByUserId(
        userId: number, 
        profileId: number, 
        quantity: number, 
        height: number, 
        width: number
    ): Promise<CartModel> {
        const cart = await this.getLatestCartByUserId(userId, {loadProfiles: true});
        const filteredProfiles = cart.profiles.filter(a => a.profileId === profileId);
        const filteredProfileHeights = cart.profiles.filter(a => a.height === height);
        const filteredProfileWidths = cart.profiles.filter(a => a.width === width);

        if (filteredProfiles.length >= 1 && filteredProfileHeights.length >= 1 && filteredProfileWidths.length >= 1) {
            if (quantity > 0) {
                await this.db.execute(
                    `UPDATE cart_profile SET quantity = ? WHERE cart_id = ? AND profile_id = ? AND height = ? AND width = ?;`,
                    [
                        quantity,
                        cart.cartId,
                        profileId,
                        height,
                        width,
                    ]
                );
            } else {
                await this.db.execute(
                    `DELETE FROM cart_profile WHERE cart_id = ? AND profile_id = ? AND height = ? AND width = ?;`,
                    [
                        cart.cartId,
                        profileId,
                        height,
                        width,
                    ]
                );
            }
        } else {
            if (quantity > 0) {
                await this.db.execute(
                    `INSERT cart_profile SET quantity = ?, cart_id = ?, profile_id = ?, height = ?, width = ?`,
                    [
                        quantity,
                        cart.cartId,
                        profileId,
                        height,
                        width,
                    ]
                );
            }
        }

        return await this.getById(cart.cartId, {loadProfiles: true}) as CartModel;
    }

    public async makeOrder(userId: number, data): Promise<CartModel|IErrorResponse> {
        return new Promise<CartModel|IErrorResponse>(async resolve => {
            const cart = await this.getLatestCartByUserId(userId, {
                loadProfiles: true,
            });

            if (cart.profiles.length === 0) {
                return resolve({
                    errorCode: -3011,
                    errorMessage: "You cannot make an order with an empty cart",
                });
            }

            this.db.execute(
                `INSERT INTO \`order\` SET cart_id = ?, first_name = ?, last_name = ?, address = ?;`,
                [
                    cart.cartId,
                    data.firstName,
                    data.lastName,
                    data.address
                ],
            )
            .then(async () => {
                resolve(await this.getById(cart.cartId, {
                    loadProfiles: true,
                    loadOrder: true,
                    loadUser: true,
                }));
            })
            .catch(err => {
                resolve({
                    errorCode: err?.errno,
                    errorMessage: err?.sqlMessage,
                });
            })
        });
    }    

    public async getAllOrdersByUserId(userId: number): Promise<CartModel[]> {
        const [ rows ] = await this.db.execute(
            `SELECT
                cart.*
            FROM
                cart
            INNER JOIN \`order\` ON \`order\`.cart_id = cart.cart_id
            WHERE
                cart.user_id = ?
            ORDER BY
                \`order\`.created_at DESC;`,
            [ userId ]
        );
        console.log(rows)

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: CartModel[] = [];

        for (const row of rows) {
            const data: any = row;

            items.push(await this.adaptModel(data, {
                loadProfiles: true,
                loadOrder: true,
                loadUser: true,
            }));
        }

        return items;
    }

    public async getAllOrders(): Promise<CartModel[]> {
        const [ rows ] = await this.db.execute(
            `SELECT
                cart.*
            FROM
                cart
            INNER JOIN \`order\` ON \`order\`.cart_id = cart.cart_id
            ORDER BY
                \`order\`.created_at DESC;`
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: CartModel[] = [];

        for (const row of rows) {
            const data: any = row;

            items.push(await this.adaptModel(data, {
                loadProfiles: true,
                loadOrder: true,
                loadUser: true,
                // profileModelAdapterOptions: {
                //     loadCategory: true,
                //     loadPhotos: true,
                //     loadPrices: true,
                // }
            }));
        }

        return items;
    }
}
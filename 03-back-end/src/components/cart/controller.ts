import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IAddCart, { IAddToCartValidator } from "./dto/ICart";
import CartModel from "./model";

export default class CartController extends BaseController {
    private isCallerUser(req: Request, res: Response): boolean {
        if (req.authorized?.role !== "user") {
            res.status(403).send("This action is only available to the user role");
            return false;
        }

        if (!req.authorized?.id) {
            res.status(403).send("Unknown user identifier");
            return false;
        }

        return true;
    }


    public async getCurrentCart(req: Request, res: Response, next: NextFunction) {
        if (!this.isCallerUser(req, res)) return;

        res.send(await this.services.cartService.getLatestCartByUserId(req.authorized?.id));
    }

    public async addToCart(req: Request, res: Response, next: NextFunction) {
        if (!this.isCallerUser(req, res)) return;

        if (!IAddToCartValidator(req.body)) {
            return res.status(400).send(IAddToCartValidator.errors);
        }

        const data = req.body as IAddCart;

        const profile = await this.services.profileServices.getById(data.profileId);

        if (profile === null) {
            return res.status(404).send("Profile not found");
        }

        res.send(
            await this.services.cartService.addProfileToLatestCartByUserId(
                req.authorized?.id,
                data.profileId,
                data.quantity,
                data.height,
                data.width
            )
        );
    }

    public async setInCart(req: Request, res: Response, next: NextFunction) {
        if (!this.isCallerUser(req, res)) return;

        if (!IAddToCartValidator(req.body)) {
            return res.status(400).send(IAddToCartValidator.errors);
        }

        const data = req.body as IAddCart;

        const profile = await this.services.profileServices.getById(data.profileId);

        if (profile === null) {
            return res.status(404).send("Profile not found");
        }

        res.send(
            await this.services.cartService.setProfileToLatestCartByUserId(
                req.authorized?.id,
                data.profileId,
                data.quantity,
                data.height,
                data.width
            )
        );
    }

    public async makeOrder(req: Request, res: Response, next: NextFunction) {
        if (!this.isCallerUser(req, res)) return;
        const data = req.body;

        const order = await this.services.cartService.makeOrder(req.authorized?.id, data);

        if (!(order instanceof CartModel)) {
            return res.status(400).send(order);
        }

        res.send(order);
    }

    public async getAllOrdersForCurrentUser(req: Request, res: Response, next: NextFunction) {
        if (!this.isCallerUser(req, res)) return;
        
        res.send(await this.services.cartService.getAllOrdersByUserId(req.authorized?.id));
    }

    public async getAllOrders(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.cartService.getAllOrders());
    }

    public async getAllOrdersByUserId(req: Request, res: Response, next: NextFunction) {
        const userId: number = +(req.params?.uid);
console.log(userId)
        if (userId < 0) {
            return res.status(400).send("Invalid user ID");
        }

        res.send(await this.services.cartService.getAllOrdersByUserId(userId));
    }
}
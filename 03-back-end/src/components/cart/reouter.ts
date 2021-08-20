import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import CartController from './controller';

export default class CartRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const cartController: CartController = new CartController(resources);

        application.get(
            "/cart", 
            AuthMiddleware.getVerifier("user"),
            cartController.getCurrentCart.bind(cartController)
        );
        application.post(
            "/cart", 
            AuthMiddleware.getVerifier("user"),
            cartController.addToCart.bind(cartController)
        );
        application.put(
            "/cart", 
            AuthMiddleware.getVerifier("user"),
            cartController.setInCart.bind(cartController)
        );
        application.post(
            "/cart/order", 
            AuthMiddleware.getVerifier("user"),
            cartController.makeOrder.bind(cartController)
        );
        application.get(
            "/cart/order/my", 
            AuthMiddleware.getVerifier("user"),
            cartController.makeOrder.bind(cartController)
        );
        application.get(
            "/order", 
            AuthMiddleware.getVerifier("administrator"),
            cartController.getAllOrders.bind(cartController)
        );
        application.get(
            "/user/:uid/order/  ", 
            AuthMiddleware.getVerifier("administrator"),
            cartController.getAllOrdersByUserId.bind(cartController)
        );
        
    }
}
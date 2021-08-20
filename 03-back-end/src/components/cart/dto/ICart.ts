import Ajv from "ajv";

interface IAddCart {
    userId: number;
    profileId: number;
    quantity: number;
    height: number;
    width: number;
}

const ajv = new Ajv();

const IAddToCartValidator = ajv.compile({
    type: "object",
    properties: {
        profileId: {
            type: "integer",
            minimum: 1,
        },
        quantity: {
            type: "integer",
            minimum: 1,
        },
        height: {
            type: "number",
            multipleOf: 0.01,
        },
        width: {
            type: "number",
            multipleOf: 0.01,
        },
    },
    required: [
        "profileId",
        "quantity",
        "height",
        "width",
    ],

    additionalProperties: false,
});

export default IAddCart;
export {IAddToCartValidator};
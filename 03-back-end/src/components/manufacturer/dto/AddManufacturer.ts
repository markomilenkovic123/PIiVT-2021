import Ajv from 'ajv';

interface IAddManufacturer {
    name: string;
    createdAt: Date;
}

const ajv = new Ajv();

const IAddManufacturerValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
    },
    required: [
        "name",
    ],
    additionalProperties: false
});

export { IAddManufacturer };
export { IAddManufacturerValidator };
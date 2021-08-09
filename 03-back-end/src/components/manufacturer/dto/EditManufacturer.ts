import Ajv from 'ajv';

interface IEditManufacturer {
    name: string;
}

const ajv = new Ajv();

const IEditManufacturerValidator = ajv.compile({
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

export { IEditManufacturer };
export { IEditManufacturerValidator };
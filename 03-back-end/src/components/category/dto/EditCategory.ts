import Ajv from 'ajv';

interface IEditCategory {
    name: string;
    description: string;
    imagePath: string|null;
}

const ajv = new Ajv();

const IEditCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        description: {
            type: "string",
            maxLength: 255,
        },
        imagePath: {
            type: ["string", "null"],
            maxLength: 128,
            pattern: "\.(png|jpg)$"
        }
    },
    required: [],
    additionalProperties: false
});

export { IEditCategory };
export { IEditCategoryValidator };
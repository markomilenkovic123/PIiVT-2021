import Ajv from 'ajv';

interface IAddCategory {
    name: string;
    description: string;
    imagePath: string|null;
}

const ajv = new Ajv();

const IAddCategoryValidator = ajv.compile({
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
    required: [
        "name",
        "description"
    ],
    additionalProperties: false
});

export { IAddCategory };
export { IAddCategoryValidator };
import Ajv from 'ajv';

interface IEditUser {
    username: string;
    password: string;
}

const ajv = new Ajv();

const IEditUserValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
    },
    required: [
        
    ],
    additionalProperties: false
});

export { IEditUser };
export { IEditUserValidator };
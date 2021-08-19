import Ajv from 'ajv';

interface IAddUser {
    username: string;
    password: string;
    email: string;
}

const ajv = new Ajv();

const IAddUserValidator = ajv.compile({
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
        email: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
    },
    required: [
        "username",
        "password",
        "email",
    ],
    additionalProperties: false
});

export { IAddUser };
export { IAddUserValidator };
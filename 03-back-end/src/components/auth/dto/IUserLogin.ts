import Ajv from 'ajv';

interface IUserLogin {
    email: string;
    password: string;
}

const ajv = new Ajv();

const IUserLoginValidator = ajv.compile({
    type: "object",
    properties: {
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
        "password",
        "email",
    ],
    additionalProperties: false
});

export { IUserLogin };
export { IUserLoginValidator };
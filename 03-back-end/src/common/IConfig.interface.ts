import { Algorithm } from "jsonwebtoken";

interface TokenKeyOptions {
    private: string;
    public: string;
    duration: number;
}

interface TokenOptions {
    auth: TokenKeyOptions,
    refresh:TokenKeyOptions,
    issuer: string;
    algorithm: Algorithm,
}

export default interface IConfig {
    server: {
        port: number,
        static: {
            path: string,
            route: string,
            cacheControl: boolean,
            dotfiles: string,
            etag: boolean,
            maxAge: number,
            index: boolean,
        },
    },
    database: {
        host: string,
        port: number,
        user: string,
        password: string,
        database: string,
        charset: string,
        timezone: string,
    },
    fileUpload: {
        maxSize: number;
        maxFiles: number;
        temporaryDirectory: string; 
        timeout: number;
        uploadDestinationDirectory: string;
        photos: {
            limits: {
                minWidth: number;
                maxWidth: number;
                minHeight: number;
                maxHeight: number;
            },
            resizes: {
                sufix: string;
                width: number;
                height: number;
                fit: "cover"|"contain";
            }[]
        }
    },
    mail: {
        hostname: string;
        port: number;
        secure: boolean;
        username: string;
        password: string;
        fromEmail: string;
        debug: boolean;
        
    },
    auth: {
        user: TokenOptions,
        administrator: TokenOptions,
        allowRequestsEvenWithoutValidTokens: boolean,
    }
}

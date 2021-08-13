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
    logger: {
        path: string,
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
    }
}

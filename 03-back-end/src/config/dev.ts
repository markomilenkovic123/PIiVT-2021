import IConfig from "../common/IConfig.interface";

const Config: IConfig = {
    server: {
        port: 3001,
        static: {
            index: false,
            cacheControl: true,
            dotfiles: "deny",
            maxAge: 3600000,
            etag: true,
            path: "static/",
            route: "/static",
        },
    },
    database: {
        host: "localhost",
        user: "root",
        database: "aplikacija",
        password: "root",
        port: 3306,
        charset: "utf8",
        timezone: "+01:00",
    },
    fileUpload: {
        maxSize: 5 * 1024 * 1024,
        maxFiles: 5,
        temporaryDirectory: "../temp/",
        timeout: 30000,
        uploadDestinationDirectory: "static/uploads/",
        photos: {
            limits: {
                minWidth: 320,
                maxWidth: 1920,
                minHeight: 200,
                maxHeight: 1440,
            },
            resizes: [
                {
                    sufix: "-small",
                    fit: "cover",
                    width: 400,
                    height: 300,
                },
                {
                    sufix: "-thumb",
                    fit: "cover",
                    width: 250,
                    height: 200,
                },
                {
                    sufix: "-medium",
                    fit: "cover",
                    width: 800,
                    height: 600,
                }
            ]
        }
    }
};

export default Config;

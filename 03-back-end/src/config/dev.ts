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

    logger: {
        path: "logs/access.log"
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
};

export default Config;

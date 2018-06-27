module.exports = {
    secret: process.env.JWT_SECRET || "Supinf0!",
    storageDir: process.env.STORAGE_DIR || "C:/Content/",
    serverName: process.env.SERVER_NAME || "http://localhost:3000",
    mongoHost: process.env.MONGO_HOST || "localhost",
    mongoPort: process.env.MONGO_PORT || "27017",
    mongoDb: process.env.MONGO_DB || "SupFileDB",
    maxUploadSize: process.env.MAX_UPLOAD_SIZE || "50mb",
    port: process.env.PORT || 3000
}
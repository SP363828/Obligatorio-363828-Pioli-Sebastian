const mongoose = require("mongoose");

const connectMongoDB = async () => {
    // Si ya está conectado (contenedor "caliente" en serverless, o ya
    // conectamos antes en esta misma corrida local), no hacemos nada.
    if (mongoose.connection.readyState === 1) {
        return;
    }

    const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
    const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME;
    const MONGODB_CONNECTION_TIMEOUT = process.env.MONGODB_CONNECTION_TIMEOUT;

    try {
        await mongoose.connect(`${MONGODB_CONNECTION_STRING}/${MONGODB_DATABASE_NAME}`, {
            serverSelectionTimeoutMS: MONGODB_CONNECTION_TIMEOUT,
        });
        console.log("Conexion a mongo db establecida correctamente");
    } catch (error) {
        console.error("Ocurrio un error al conectarse a MongoDB", error);
        throw error;
    }
};

module.exports = connectMongoDB;
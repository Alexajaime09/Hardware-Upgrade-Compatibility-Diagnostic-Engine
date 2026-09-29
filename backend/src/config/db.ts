import mongoose from "mongoose";

// Guardamos la referencia viva de la conexión a MongoDB
export let dbReference: typeof mongoose | null = null;

export const connectDatabase = async (
  mongoUri: string,
): Promise<typeof mongoose> => {
  if (dbReference) {
    console.log("⚡ DataBase reference active with existing connection");
    return dbReference;
  }

  try {
    const conexion = await mongoose.connect(mongoUri);
    dbReference = conexion;
    console.log(
      `Successful connection to MongoDB: ${conexion.connection.host}`,
    );
    return dbReference;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

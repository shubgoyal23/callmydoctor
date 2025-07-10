import Mongoose from "mongoose";
let isDbConnected = false;

const globalForMongoDb = globalThis as unknown as {
  mongoDbClient?: typeof Mongoose;
};

export default async function () {
  if (isDbConnected) return;
  try {
    const connection = await Mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_DBNAME}`,
    );
    if (connection.connection.host) {
      isDbConnected = true;
    }
    globalForMongoDb.mongoDbClient = connection;
  } catch (error) {
    console.log(error);
  }
}

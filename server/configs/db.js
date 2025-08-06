import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    })
    await mongoose
      .connect(`${process.env.MONGODB_URI}`)
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;


import mongoose from "mongoose";

async function connectDB() {
    await mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Connected to db🌞"))
    .catch((err) => console.log(err));


}

export default connectDB
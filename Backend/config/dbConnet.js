import mongoose from "mongoose";


async function dbConnect() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Instagram_Clone")
        console.log("db Connected Succesfully");

    } catch (error) {
        console.log(error);
    }
}

export default dbConnect
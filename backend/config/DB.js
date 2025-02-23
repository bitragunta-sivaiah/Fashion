import mongoose from "mongoose";


 const CONNECTDB = async  () => {
    try {
        console.log(process.env.MONGO_URL)
     await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB connected...');
    } catch (error) {
        console.log('Error connecting to MongoDB',error);
    }
 }

 export default CONNECTDB;
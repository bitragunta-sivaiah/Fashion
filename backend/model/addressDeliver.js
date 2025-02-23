import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const AddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  address3: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
  country: { type: String, required: true },
  deliverPlace: {
    type: String,
    enum: ["Work", "Home"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Address = mongoose.model("Address", AddressSchema);

export default Address;

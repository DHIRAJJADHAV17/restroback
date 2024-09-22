import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const reviewItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  about: { type: String, required: true },
});

const restroSchema = new mongoose.Schema({
  user: { type: String },
  restaurantName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  cuisines: [{ type: String, required: true }],
  menuItems: [menuItemSchema],
  imageUrl: { type: String, required: true },
  review: [reviewItemSchema],
  description: { type: String, required: true },
});

const Restro = mongoose.model("restro", restroSchema);

export default Restro;

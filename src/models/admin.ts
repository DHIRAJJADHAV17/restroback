import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  matchPassword(enteredPass: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminSchema.methods.matchPassword = async function (enteredpass: string) {
  return await bcrypt.compare(enteredpass, this.password);
};
adminSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model("admin", adminSchema);

export default Admin;

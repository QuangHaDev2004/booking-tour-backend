import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    status: String,
    password: String,
  },
  {
    timestamps: true, // createAt - updatedAt
  }
);

const AccountAdmin = mongoose.model("AccountAdmin", schema, "account-admin");

export default AccountAdmin;

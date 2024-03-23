import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // extra props can be added here
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // mongoose String, not ts
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, returnObj) {
        returnObj.id = returnObj._id;
        delete returnObj.password;
        delete returnObj.__v;
        delete returnObj._id;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  // we user 'function' to have context for 'this'

  // mongoose way to check if passpord was modified and needs to be hashed
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

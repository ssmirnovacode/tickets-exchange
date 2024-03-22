import mongoose from "mongoose";

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

const userSchema = new mongoose.Schema({
  email: {
    type: String, // mongoose String, not ts
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

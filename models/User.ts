// models/User.ts
import { DataTypes, Model } from "../deps.ts";

class User extends Model {
  static table = "users";
  static timestamps = true;

  static fields = {
    id: { primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
  };

  static defaults = {
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default User;

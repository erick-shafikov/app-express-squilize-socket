import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  HasManyGetAssociationsMixin,
} from "sequelize";
import sequelize from "@app/global/sequelize";
import User from "./user.js";

class Message extends Model<
  InferAttributes<Message>,
  InferCreationAttributes<Message>
> {
  declare getUser: HasManyGetAssociationsMixin<InstanceType<typeof User>>;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
  },
  {
    modelName: "Message",
    sequelize,
  }
);

Message.belongsTo(User);
User.hasMany(Message);

export default Message;

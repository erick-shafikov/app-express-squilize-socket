import {
  DataTypes,
  Model,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "@app/global/sequelize.js";
import User from "@app/models/user";
import Error404 from "@app/core/errors/error404";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare content: string;
  declare UserId?: ForeignKey<InstanceType<typeof User>["id"]>;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 255],
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [25, 1000],
      },
    },
  },
  {
    modelName: "Post",
    sequelize,
  }
);

Post.belongsTo(User);
User.hasMany(Post);
// TODO as any
(Post as any).findByPkOrFail = async function (pk: string, options = {}) {
  const res = await this.findByPk(pk, options);

  if (res === null) {
    throw new Error404("post not found");
  }

  return res;
};

export default Post;

import { Model, DataTypes, Sequelize} from 'sequelize';
//import { sequelize } from 'Users/ashis/Desktop/code/Sift/hwk/phase3/node_modules/sequelize'; // NEED TO FIGURE OUT THE PATH

// Users/ashis/Desktop/code/Sift/hwk/phase3/node_modules/sequelize/lib
class Movie extends Model {
  public id!: number;
  public name!: string;
  public director!: string;
  public rating!: number;
  public genre!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: new Sequelize('database', 'username', 'password', {
        dialect: 'postgres',
        host: 'localhost',
      }),
      modelName: 'Movie',
  
  }
);

export { Movie };

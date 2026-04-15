import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Availability = sequelize.define(
    "Availability",
    {
        id: {
            type:DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        doctorId : {
            type:DataTypes.STRING,
            allowNull:false
        },
        date:{
            type:DataTypes.DATEONLY,
            allowNull: false
        },
        startTime : {
            type:DataTypes.TIME,
            allowNull: false
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: false
        }
    },
    {
        tableName:"availabilities",
        timestamps:true
    }
);
export default Availability;
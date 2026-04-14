import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Prescription = sequelize.define(
    "Prescription",
    {
        id:{ 
           type:DataTypes.UUID,
           defaultValue: DataTypes.UUIDV4,
           primaryKey:true 
        },
        appointmentId:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },

        doctorId:{
            type:DataTypes.STRING,
            allowNull:false,
            
        },
         patientId:{
            type:DataTypes.STRING,
            allowNull:false,
            
        },

        medications:{
            type:DataTypes.JSONB,
            allowNull:false,
        },
         notes:{
            type:DataTypes.TEXT,
            allowNull:true,
        }
    },
    {
        tableName: "prescriptions",
        timestamps:true
    }
);

export default Prescription;
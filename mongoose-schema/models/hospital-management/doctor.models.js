import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    specialization:{
        type: String,
        required: true
    },
    experience:{
        type: Number,
        default: 0,
        required: true
    },
    salary:{
        type: Number,
        required: true
    },
    worksInHospitals:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        }
    ],
    qualification:{
        type: String,
        required: true
    }
});

export const Doctor = mongoose.model('Doctor', doctorSchema);
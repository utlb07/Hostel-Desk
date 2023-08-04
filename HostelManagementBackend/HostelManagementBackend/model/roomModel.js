import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    room: {
        type : Number,
        unique : true, 
        required: true 
    },
    
    countStudent : {
        type : Number,
        default : 0 
    }
});

export default mongoose.model("Rooms", roomSchema);
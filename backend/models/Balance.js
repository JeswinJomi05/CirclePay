import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
    user_id:{
        type: Number,
        required: true
    },
    balance:{
        type: Number,
        required: true,
    },
    income:{
        type: Number,
        required: true,
    },
    expense:{
        type: Number,
        required: true,
    }
})


const Balance = mongoose.model('Balance', balanceSchema);
export default Balance;
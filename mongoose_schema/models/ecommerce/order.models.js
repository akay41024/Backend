import mongoose from "mongoose";


const orderItemsSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice:{
        type: Number,
        required: true,
        default: 0
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems:{
        type: [orderItemsSchema],
        required: true
    },
    address:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "processing", "shipped", "delivered"],
        required: true,
        default: "pending"
    }

}, {timestamps: true});


export const Order = mongoose.model("Order", orderSchema);
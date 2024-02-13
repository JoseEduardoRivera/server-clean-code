import mongoose, { Schema } from "mongoose";


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
    },
    available:{
        type:Boolean,
        default:false,
    },
    price:{
        type:Number,
        default:0,
    },
    description:{
        type:String,
    },
    user:{
        type:Schema.Types.ObjectId, //ID de mongo obligatiorio,
        ref:'User',
        required: [true, 'User is required']
    },
    category: {
        type:Schema.Types.ObjectId, //ID de mongo obligatiorio,
        ref:'Category',
        required: [true, 'Category is required']
    }


});

export const ProductModel = mongoose.model('Product', productSchema);


import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    regularPrice:{
        type:Number,
        required:true
    },
    DiscountPrice:{
        type:Number,
        required:true
    },
    bathrooms:{
        type:Number,
        required:true
    },
    bedrooms:{
        type:Number,
        required:true
    },
    parking:{
        type:Boolean,
        required:true
    },
    furnished:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    offer:{
        type:Boolean,
        required:true
    },
    imageURLs:{
        type:Array,
        required:true
    },
    useRef:{
        type:String,
        required:true 
    }

}, {timestamps:true})

const Listing = mongoose.model('listing',ListingSchema)
export default Listing;
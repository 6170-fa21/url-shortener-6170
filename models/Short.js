const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShortSchema = new Schema(
    {
        // note that we don't have a short_id field, by default mongoDB creates this field, which is our Primary Key
        "short_original_url": {
            type: String,
            required: true,
        },
        "short_name": {
            type: String,
            required: true,
        },
        // we set a default value here to be 0
        "short_visit_count": {
            type: Number,
            required: false,
            default: 0,
        },
        // reference to _id field in the User collection
        "short_creator_id": {
            type: Schema.Types.ObjectId, 
            ref: "User",
            required: false,
        },
        
    }
);

// mongoose will automatically create the collection for our DB
module.exports = mongoose.model("Short", ShortSchema);

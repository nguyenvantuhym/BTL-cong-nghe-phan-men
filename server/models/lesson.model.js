const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let lessonSchema = new Schema({
    title :String,
    description:String,
    cards:[{
        front:String,
        back:String,
        orderNum:Number                        
    }],

    author:String
});

module.exports = mongoose.model('lesson',lessonSchema);


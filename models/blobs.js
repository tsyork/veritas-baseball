/**
 * Created by timyork on 10/12/15.
 */
var mongoose = require('mongoose');

var blobSchema = new mongoose.Schema({
    name: String,
    badge: Number,
    dob: { type: Date, default: Date.now },
    isloved: Boolean
});
mongoose.model('Blob', blobSchema);
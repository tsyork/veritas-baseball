/**
 * Created by timyork on 10/12/15.
 */
var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: false },
  subject: { type: String, required: true, unique: false },
  comment: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: false },
  from_user: { type: String, required: false, unique: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schemas are useless so far
// we need to create models using them
mongoose.model('message', messageSchema);
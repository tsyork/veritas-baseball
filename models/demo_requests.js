/**
 * Created by timyork on 10/12/15.
 */
var mongoose = require('mongoose');

var demoRequestSchema = new mongoose.Schema({
    priorities: { type: String, required: false, unique: false },
    subscriptions: { type: String, required: false, unique: false },
    other_info: { type: String, required: false, unique: false },
    pref_date: { type: Date, required: false, unique: false },
    email: { type: String, required: true, unique: false },
    phone_number: { type: String, required: false, unique: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    newsletter: { type: Boolean, default: false, unique: false},
    status: {type: String, default: "New", unique: false},
    assigned_to: {type: String, default: "", unique: false},
    demo_datetime: {type: Date, unique: false},
    notes: {type: String, unique: false}
});

mongoose.model('demo_request', demoRequestSchema);

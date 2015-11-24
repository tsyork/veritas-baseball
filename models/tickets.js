/**
 * Created by timyork on 10/12/15.
 */
var mongoose = require('mongoose');

var ticketSchema = new mongoose.Schema({
    issue_type: { type: String, required: true, unique: false },
    location: { type: String, required: false, unique: false },
    subject: { type: String, required: true, unique: false },
    description: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: false },
    from_user: { type: String, required: false, unique: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    assigned_to: { type: String, required: false, unique: false },
    status: {
        type: String,
        enum: ['Unassigned', 'Open', 'In Process', 'Resolved'],
        default: 'Unassigned'
    }
});

mongoose.model('ticket', ticketSchema);
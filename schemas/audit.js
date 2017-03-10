const mongoose = require('mongoose');

const AuditSchema = mongoose.Schema({
  username: String,
  eventTime: Date,
  eventType: String
});

module.exports = mongoose.model('Audit', AuditSchema);

const Audit = require('../schemas/audit');

class AuditModel {

  constructor() {}

  logEvent(newEvent) {
    let event = new Audit(newEvent);

    event.save((err) => {
      if (err) console.log(err);
    });
  }
}

module.exports = new AuditModel();

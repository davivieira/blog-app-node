const Audit = require('../schemas/audit');

class AuditModel {

  constructor() {
  }

  logEvent(newEvent) {
    return new Promise((resolve, reject) => {
      let event = new Audit(newEvent);

      event.save((err, event) => {
        if (err) reject(err);

        resolve(event);
      });
    });
  }
}

module.exports = new AuditModel();

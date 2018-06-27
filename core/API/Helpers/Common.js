exports.sendError = (err, res) => res.json({ success: false, data: { message: err } });

exports.sendSuccess = (msg, res) => res.json({ success: true, data: { message: msg } });
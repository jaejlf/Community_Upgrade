const moment = require("moment");
require("moment-timezone");

const dateNow = (req, res) => {
    return moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
};

module.exports = {
    dateNow,
};
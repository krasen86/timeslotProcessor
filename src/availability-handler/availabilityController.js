const {ChangeController} = require("./changeController");


class AvailabilityController {
    constructor() {
    }
    processMessage(message) {
        const buffer = message.toString('utf-8');

        const changeController = new ChangeController();

        changeController.checkChange(buffer)
    }
}
module.exports.AvailabilityController = AvailabilityController
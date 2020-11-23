class AvailabilityController {
    constructor() {
    }
    processMessage(message) {
        const buffer = message.toString('utf-8');
        console.log(JSON.parse(buffer));
    }

}
module.exports.AvailabilityController = AvailabilityController
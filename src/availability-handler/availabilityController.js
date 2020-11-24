class AvailabilityController {
    constructor() {
    }
    processMessage(message) {
        const buffer = message.toString('utf-8');
        //console.log(buffer)
        this.splitMessage(buffer);
    }

    splitMessage(message) {
        const clinics = JSON.parse(message).dentists
        //console.log(clinics)
        for (var i = 0; i < clinics.length ; i++ ) {

            //add availability Array to each clinic
            clinics[i].availability = []


            clinics[i].availability.push({"2020-10-23": [{"08.00 - 08.30": 2}]})
        }





        console.log(JSON.stringify(clinics,null, " "))

    }

}
module.exports.AvailabilityController = AvailabilityController
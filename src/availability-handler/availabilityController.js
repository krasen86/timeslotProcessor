const Variables = require("../config/variables");

class AvailabilityController {
    constructor() {
    }
    processMessage(message) {
        const buffer = message.toString('utf-8');
        //console.log(buffer)
        this.splitMessage(buffer);
    }
    createTimeslot(clinics, j, day) {
        const timeArray = []

        //get openinghours depending on day
        if (day === Variables.MONDAY) {
            var start = clinics[j].openinghours.monday.split('-')[0]
            var close = clinics[j].openinghours.monday.split('-')[1]
        }
        if (day === Variables.TUESDAY) {
            var start = clinics[j].openinghours.tuesday.split('-')[0]
            var close = clinics[j].openinghours.tuesday.split('-')[1]
        }
        if (day === Variables.WEDNESDAY) {
            var start = clinics[j].openinghours.wednesday.split('-')[0]
            var close = clinics[j].openinghours.wednesday.split('-')[1]
        }
        if (day === Variables.THURSDAY) {
            var start = clinics[j].openinghours.thursday.split('-')[0]
            var close = clinics[j].openinghours.thursday.split('-')[1]
        }
        if (day === Variables.FRIDAY) {
            var start = clinics[j].openinghours.friday.split('-')[0]
            var close = clinics[j].openinghours.friday.split('-')[1]
        }

        //parse hour and minutes for opening

            let startHour = parseInt(start.split(':')[0])
            let startMinute = '00'

        //parse hour for closing to calculate amount of timeslots

            let closeTime = close.split(':')[0]
            let timeSlots = (closeTime-startHour)*2

        //assign temp variables to manipulate within for loop

            let tempHour = startHour
            let tempMinute = startMinute

        //for loop pushes to timearray on first iteration with only adding +30 minutes to endtime of timeslot
        //iterate as many times as there are supposed to be timeslots

            for (var i=0; i<timeSlots; i++){
                if(i === 0) {
                    timeArray.push({[startHour + ':' + tempMinute + ' - ' + (startHour) + ':' + (parseInt(tempMinute+30))]: clinics[j].dentists})
                }else {
                    tempMinute = parseInt(tempMinute) + 30
        //check if hour needs to be added
                    if (tempMinute === 60) {
                        tempMinute = '00'
                        tempHour += 1
                    }
        //create ending hours and minutes for the timeslots, always 30 minutes
                    var endHour = tempHour
                    var endMinute = parseInt(tempMinute) + 30

                    if (endMinute === 60) {
                        endMinute = '00'
                        endHour += 1
                    }
        //push the timeslot for every iteration to the array, with the amount of dentists the clinic has
                    timeArray.push({[tempHour + ':' + tempMinute + ' - ' + endHour + ':' +endMinute]: clinics[j].dentists})
                }
            }
        return timeArray;

    }
    splitMessage(message) {
        const clinics = JSON.parse(message).dentists
        //console.log(clinics)
        for (var i = 0; i < clinics.length; i++ ) {
            //add availability Array to each clinic
            clinics[i].availability = []

            var dateObj = new Date(Date.now())

            for(var j = 0; j<365; j++) {

                var repeatDate = dateObj.setDate(dateObj.getDate() + 1)
                var repeats = new Date(repeatDate)

                var dateString = repeats.toLocaleString("sv-SE")
                var date = dateString.split(' ')[0]

                var day = repeats.getDay()

                //check if day is saturday or sunday
                if(day != 6 && day != 0) {
                    clinics[i].availability.push({[date]: this.createTimeslot(clinics, i, day)})
                }
            }
        }
         //console.log(JSON.stringify(clinics,null, " "))
    }

}
module.exports.AvailabilityController = AvailabilityController
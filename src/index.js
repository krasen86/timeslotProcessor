const {MQTT} = require("./services/mqttConnector");
const {Subscriber} = require("./services/subscriber");
const variables = require("./config/variables");
const {BrokerListener} = require("./services/brokerListener");
const {AvailabilityDateController} = require("./availabilityDate-handler/availabilityDateController");

MQTT.on('connect', function () {
   let subscriber = new Subscriber();
   subscriber.connectToBroker();
   subscriber.subscribeToTopic(variables.DENTIST_TOPIC);
   subscriber.subscribeToTopic(variables.BOOKING_TOPIC)
   let listener = new BrokerListener();
   listener.listenForMessage();
   let availabilityDateController = new AvailabilityDateController();
   availabilityDateController.initiateAvailabilityPerDay();
})
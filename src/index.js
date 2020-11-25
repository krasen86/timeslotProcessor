const {MQTT} = require("./dentist-watcher/mqttConnector");
const {Subscriber} = require("./dentist-watcher/subscriber");
const variables = require("./config/variables");
const {BrokerListener} = require("./dentist-watcher/brokerListener");


MQTT.on('connect', function () {
   let subscriber = new Subscriber();
   subscriber.connectToBroker();
   subscriber.subscribeToTopic(variables.DENTIST_TOPIC);
   let listener = new BrokerListener();
   listener.listenForMessage();
})







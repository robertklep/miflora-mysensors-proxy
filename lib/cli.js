const mqtt   = require('mqtt');
const debug  = require('debug')('miflora-mysensors-proxy');
const config = require('rc')('miflora-mysensors-proxy');

// Create MQTT clients.
const miFloraClient   = mqtt.connect(config.mqtt.miflora.broker);
const mySensorsClient = mqtt.connect(config.mqtt.mysensors.broker);

const MIFLORA_PREFIX   = config.mqtt.miflora  ['topic prefix'];
const MYSENSORS_PREFIX = config.mqtt.mysensors['topic prefix'];

module.exports = () => {
  debug('subscribing to MiFlora topics');
  // Subscribe to MiFlora topics and listen for messages.
  miFloraClient.subscribe(MIFLORA_PREFIX + '/#').on('message', (topic, payload) => {
    let sensorData = JSON.parse(payload);
    debug(`received message on ${ topic }: ${ payload }`);

    // Find related MySensors node.
    let sensorName = topic.replace(/^.*\//, '');
    let nodeId     = config.sensors[sensorName];
    if (! nodeId) {
      return console.error('received message for unknown sensor');
    }
    debug(`republishing to MySensors with node id ${ nodeId }`);

    // Republish to MySensors topics.
    let prefix = MYSENSORS_PREFIX + `/${ nodeId }/`;

    // Presentation.
    mySensorsClient.publish(prefix + '255/0/0/17', '2.1.1');                    // I_NONCE_RESPONSE
    mySensorsClient.publish(prefix + '255/3/0/11', 'MiFlora');                  // I_SKETCH_NAME
    mySensorsClient.publish(prefix + '255/3/0/12', '1.0');                      // I_SKETCH_VERSION
    mySensorsClient.publish(prefix + '255/3/0/0',  String(sensorData.battery)); // I_BATTERY_LEVEL

    // Sensor setup.
    mySensorsClient.publish(prefix + '0/0/0/6',  ''); // temperature (S_TEMP)
    mySensorsClient.publish(prefix + '1/0/0/16', ''); // light (S_LIGHT_LEVEL)
    mySensorsClient.publish(prefix + '2/0/0/35', ''); // moisture (S_MOISTURE)
    mySensorsClient.publish(prefix + '3/0/0/39', ''); // conductivity (S_WATER_QUALITY)

    // Sensor data.
    mySensorsClient.publish(prefix + '0/1/0/0',  String(sensorData.temperature));  // V_TEMP
    mySensorsClient.publish(prefix + '1/1/0/23', String(sensorData.light));        // V_LIGHT_LEVEL
    mySensorsClient.publish(prefix + '2/1/0/37', String(sensorData.moisture));     // V_LEVEL
    mySensorsClient.publish(prefix + '3/1/0/53', String(sensorData.conductivity)); // V_EC
  });
};

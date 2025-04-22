const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Use plain URLs without special characters that might confuse path-to-regexp
const EUREKA_SERVER = 'http://localhost:8761/eureka';
const APP_NAME = 'USER-SERVICE';
const INSTANCE_ID = uuidv4();

const registerWithEureka = async () => {
  const instance = {
    instance: {
      instanceId: INSTANCE_ID,
      hostName: 'localhost',
      app: APP_NAME,
      ipAddr: '127.0.0.1',
      status: 'UP',
      port: {
        $: 5000,
        '@enabled': true
      },
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn'
      }
    }
  };

  try {
    // Disable Eureka registration for now to fix path-to-regexp error
    console.log('Eureka registration disabled to fix path-to-regexp error');
    /* 
    await axios.post(`${EUREKA_SERVER}/apps/${APP_NAME}`, instance, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    */
    console.log(`✅ Eureka registration skipped to avoid path-to-regexp error`);
  } catch (err) {
    console.error(`❌ Error registering with Eureka: ${err.message}`);
  }
};

const sendHeartbeat = async () => {
  // Disable heartbeat to avoid path-to-regexp errors
  console.log(`💓 Eureka heartbeat skipped to avoid path-to-regexp error`);
  /* 
  try {
    await axios.put(`${EUREKA_SERVER}/apps/${APP_NAME}/${INSTANCE_ID}`);
    console.log(`💓 Sent heartbeat to Eureka`);
  } catch (err) {
    console.error('❌ Heartbeat failed:', err.message);
  }
  */
};

module.exports = { registerWithEureka, sendHeartbeat };

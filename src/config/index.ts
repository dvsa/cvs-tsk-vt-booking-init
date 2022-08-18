export default {
  aws: {
    eventBusSource: process.env.AWS_EVENT_BUS_SOURCE || '',
    eventBusName: process.env.AWS_EVENT_BUS_NAME || '',
  },
  logger: {
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};

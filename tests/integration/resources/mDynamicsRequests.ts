import { APIGatewayProxyEvent } from 'aws-lambda';

const mDynamicsRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: JSON.stringify([{ name:'hello', bookingDate: '2022-01-01', vrm:'12345', testCode:'123', testDate:'2022-01-01', pNumber:'12345' }]) };

const mDynamicsMultipleRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: JSON.stringify([{ name:'hello', bookingDate: '2022-01-01', vrm:'12345', testCode:'123', testDate:'2022-01-01', pNumber:'12345' }, { name:'hello', bookingDate: '2022-01-01', vrm:'12345', testCode:'123', testDate:'2022-01-01', pNumber:'12345' }, { name:'hello', bookingDate: '2022-01-01', vrm:'12345', testCode:'123', testDate:'2022-01-01', pNumber:'12345' }]) };

const mDynamicsInvalidRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: '[{}]' };

const mDynamicsInvalidRequest2: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: '{"Im":"not array"}' };

const mDynamicsFailedRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: '[{"name":"Error","bookingDate":"2022-01-01", "vrm":"12345","testCode":"123","testDate":"2022-01-01","pNumber":"12345"}]' };

const mDynamicsUnavailableRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ path: 'NotAvailable', httpMethod: 'GET', body: '[{}]' };

const mDynamicsEmptyBodyRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ body: undefined as unknown };

export { mDynamicsRequest, mDynamicsMultipleRequest, mDynamicsInvalidRequest, mDynamicsInvalidRequest2, mDynamicsFailedRequest, mDynamicsUnavailableRequest, mDynamicsEmptyBodyRequest };

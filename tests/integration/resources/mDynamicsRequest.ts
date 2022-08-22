import { APIGatewayProxyEvent } from 'aws-lambda';

export const mDynamicsRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: JSON.stringify([{ name:'hello', bookingDate: '2022-01-01', vrm:'12345', testCode:'123', testDate:'2022-01-01', pNumber:'12345' }]) };

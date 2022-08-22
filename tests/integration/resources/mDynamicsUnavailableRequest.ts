import { APIGatewayProxyEvent } from 'aws-lambda';

export const mDynamicsUnavailableRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ path: "NotAvailable",httpMethod: "GET", body: '[{}]' };

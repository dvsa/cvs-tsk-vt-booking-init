import { APIGatewayProxyEvent } from 'aws-lambda';

export const mDynamicsInvalidRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: '[{}]' };

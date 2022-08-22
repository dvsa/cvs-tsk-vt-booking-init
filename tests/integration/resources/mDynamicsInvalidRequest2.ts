import { APIGatewayProxyEvent } from 'aws-lambda';

export const mDynamicsInvalidRequest2: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: 'POST', body: '{"Im":"not array"}' };

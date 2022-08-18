import { APIGatewayProxyEvent } from 'aws-lambda';

export const mDynamicsInvalidRequest2: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ body: '{"Im":"not array"}' };

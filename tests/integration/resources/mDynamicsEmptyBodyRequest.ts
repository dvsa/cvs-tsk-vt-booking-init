import { APIGatewayProxyEvent } from 'aws-lambda';

export const mDynamicsEmptyBodyRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ body: undefined };

import { APIGatewayProxyEvent } from 'aws-lambda';


export const mDynamicsFailedRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ body: '[{"name":"Error","bookingDate":"2022-01-01", "vrm":"12345","testCode":"12345","testDate":"2022-01-01","pNumber":"12345"}]' };


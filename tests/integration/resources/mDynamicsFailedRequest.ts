import { APIGatewayProxyEvent } from 'aws-lambda';


export const mDynamicsFailedRequest: APIGatewayProxyEvent = <APIGatewayProxyEvent>{ httpMethod: "POST", body: '[{"name":"Error","bookingDate":"2022-01-01", "vrm":"12345","testCode":"123","testDate":"2022-01-01","pNumber":"12345"}]' };


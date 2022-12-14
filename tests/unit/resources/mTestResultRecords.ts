import { DynamoDBStreamEvent } from 'aws-lambda';

export const GetDynamoStream = (i: number): DynamoDBStreamEvent => {
  switch (i) {
    case 1:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                testResultId: {
                  S: 'a1b16bae-ae57-4605-96a5-989e0f71f5e3',
                },
                vrm: {
                  S: 'JY58FPP',
                },
                vehicleType: {
                  S: 'psv',
                },
                testStationName: {
                  S: 'Rowe, Wunsch and Wisoky',
                },
                testStationPNumber: {
                  S: '87-1369569',
                },
                testStartTimestamp: {
                  S: '2021-01-14T10:36:33.987Z',
                },
                testTypes: {
                  L: [
                    {
                      M: {
                        testCode: {
                          S: 'ffv2',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T15:36:33.987Z',
                        },
                      },
                    },
                    {
                      M: {
                        testCode: {
                          S: 'lec',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
    case 2:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                testResultId: {
                  S: 'a1b16bae-ae57-4605-96a5-989e0f71f5e3',
                },
                vehicleType: {
                  S: 'trl',
                },
                trailerId: {
                  S: 'C000001',
                },
                testStationName: {
                  S: 'MyATF',
                },
                testStationPNumber: {
                  S: '87-1369569',
                },
                testStartTimestamp: {
                  S: '2021-01-14T10:36:33.987Z',
                },
                testTypes: {
                  L: [
                    {
                      M: {
                        testCode: {
                          S: 'art',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-15T10:36:33.987Z',
                        },
                      },
                    },
                    {
                      M: {
                        testCode: {
                          S: 'aat1',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
    case 3:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'MODIFY',
          },
        ],
      };
    case 4:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'REMOVE',
          },
        ],
      };
    case 5:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                testResultId: {
                  S: 'LEGACYa1b16bae-ae57-4605-96a5-989e0f71f5e3',
                },
                trailerId: {
                  S: 'C000001',
                },
                testStationName: {
                  S: 'MyATF',
                },
                testStationPNumber: {
                  S: '87-1369569',
                },
                testStartTimestamp: {
                  S: '2021-01-14T10:36:33.987Z',
                },
                testTypes: {
                  L: [
                    {
                      M: {
                        testCode: {
                          S: 'art',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-15T10:36:33.987Z',
                        },
                      },
                    },
                    {
                      M: {
                        testCode: {
                          S: 'aat1',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
    case 6:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                testResultId: {
                  S: 'a1b16bae-ae57-4605-96a5-989e0f71f5e3',
                },
                vehicleType: {
                  S: 'psv',
                },
                testStationName: {
                  S: 'MyATF',
                },
                testStationPNumber: {
                  S: '87-1369569',
                },
                testStartTimestamp: {
                  S: '2021-01-14T10:36:33.987Z',
                },
                testTypes: {
                  L: [
                    {
                      M: {
                        testCode: {
                          S: 'art',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-15T10:36:33.987Z',
                        },
                      },
                    },
                    {
                      M: {
                        testCode: {
                          S: 'aat1',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
    case 7:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                testResultId: {
                  S: 'a1b16bae-ae57-4605-96a5-989e0f71f5e3',
                },
                vrm: {
                  S: 'JY58FPP',
                },
                testStationName: {
                  S: 'Error',
                },
                testStationPNumber: {
                  S: '87-1369569',
                },
                testStartTimestamp: {
                  S: '2021-01-14T10:36:33.987Z',
                },
                testTypes: {
                  L: [
                    {
                      M: {
                        testCode: {
                          S: 'ffv2',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                    {
                      M: {
                        testCode: {
                          S: 'lec',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-15T10:36:33.987Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
    case 8:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                testResultId: {
                  S: 'a1b16bae-ae57-4605-96a5-989e0f71f5e3',
                },
                vrm: {
                  S: 'JY58FPP',
                },
                testStationName: {
                  S: 'Rowe, Wunsch and Wisoky',
                },
                testStationPNumber: {
                  S: '87-1369569',
                },
                testStartTimestamp: {
                  S: '2021-01-14T10:36:33.987Z',
                },
                testTypes: {
                  L: [
                    {
                      M: {
                        testCode: {
                          S: 'ffva',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
    case 9:
      return <DynamoDBStreamEvent>{
        Records: [
          {
            eventName: 'INSERT',
            dynamodb: {
              NewImage: {
                testResultId: {
                  S: 'a1b16bae-ae57-4605-96a5-989e0f71f5e3',
                },
                vrm: {
                  S: 'JY58FPP',
                },
                vehicleType: {
                  S: 'psv',
                },
                testStationName: {
                  S: 'Rowe, Wunsch and Wisoky',
                },
                testStationPNumber: {
                  S: '87-1369569',
                },
                testStartTimestamp: {
                  S: '2021-01-14T10:36:33.987Z',
                },
                testStatus: {
                  S: 'cancelled',
                },
                testTypes: {
                  L: [
                    {
                      M: {
                        testCode: {
                          S: 'ffv2',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                    {
                      M: {
                        testCode: {
                          S: 'lec',
                        },
                        testTypeStartTimestamp: {
                          S: '2021-01-14T10:36:33.987Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      };
    default:
      return <DynamoDBStreamEvent>{};
  }
};

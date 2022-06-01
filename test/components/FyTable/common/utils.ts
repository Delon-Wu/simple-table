import { mock } from "mockjs";

export const makeTestData = (dataLength: number): [{[key: string]: any}] => {
  return mock({
    ['data|' + dataLength]: [{
      'name': '@cname',
      'age|1-110': 100,
      'address|': '@county(true)'
    }]
  }).data;
};
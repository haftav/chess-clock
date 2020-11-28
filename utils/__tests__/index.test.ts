import {getIncrementedTime} from '../';

describe('getIncrementedTime', () => {
  it('increments correctly', () => {
    const params = {
      secondTenths: 0,
      seconds: 30,
      minutes: 0,
      hours: 0,
      days: 0,
    };

    const returnValue = {
      secondTenths: 0,
      seconds: 35,
      minutes: 0,
      hours: 0,
      days: 0,
    };
    expect(getIncrementedTime(params, 5)).toEqual(returnValue);
  });

  it('increments correctly over a minute', () => {
    const params = {
      secondTenths: 0,
      seconds: 57,
      minutes: 0,
      hours: 0,
      days: 0,
    };

    const returnValue = {
      secondTenths: 0,
      seconds: 62,
      minutes: 0,
      hours: 0,
      days: 0,
    };
    expect(getIncrementedTime(params, 5)).toEqual(returnValue);
  })
});

import React from 'react';
import { Request } from '../src/index';
import { mountWithStore } from './testHelpers';

const resolvedPromise = (...args) => Promise.resolve(...args);

describe('Connected component', () => {
  describe('When store is empty', () => {
    let fnSpy, wrapper;

    beforeEach(() => {
      fnSpy = jest.fn(resolvedPromise);
      const storeState = {
        reactReduxRequest: {}
      };

      wrapper = mountWithStore(
        <Request args={['myInitialArg']} fn={fnSpy} id="myId" />,
        storeState
      );
    });

    it('should pass correct props', () => {
      const props = wrapper.find('ReactReduxRequestView').props();
      expect(props).toEqual(
        expect.objectContaining({
          args: ['myInitialArg'],
          id: 'myId',
          preventFetch: false,
          selectorResult: {},
          fn: fnSpy
        })
      );
    });
  });

  describe('When store is not empty', () => {
    let fnSpy, wrapper;

    beforeEach(() => {
      fnSpy = jest.fn(resolvedPromise);
      const storeState = {
        reactReduxRequest: {
          myId: {
            data: 'someData',
            args: ['myInitialArg']
          }
        }
      };

      wrapper = mountWithStore(
        <Request args={['myInitialArg']} fn={fnSpy} id="myId" />,
        storeState
      );
    });

    it('should pass correct props', () => {
      const props = wrapper.find('ReactReduxRequestView').props();
      expect(props).toEqual(
        expect.objectContaining({
          args: ['myInitialArg'],
          id: 'myId',
          preventFetch: false,
          selectorResult: {
            data: 'someData',
            args: ['myInitialArg']
          },
          fn: fnSpy
        })
      );
    });
  });
});

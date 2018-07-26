import React from 'react';
import { shallow } from 'enzyme';

import { ReactReduxRequestView } from '../src/view';
import { ACTION_TYPES, STATUS } from '../src/reducer';

const resolvedPromise = (...args) => Promise.resolve(...args);

describe('ReactReduxRequestView', () => {
  describe('When mounting with empty selectorResult', () => {
    let fnSpy, renderSpy, dispatchSpy, wrapper;

    beforeEach(() => {
      fnSpy = jest.fn(resolvedPromise);
      renderSpy = jest.fn();
      dispatchSpy = jest.fn();

      const store = {
        getState: () => ({
          reactReduxRequest: {}
        })
      };

      wrapper = shallow(
        <ReactReduxRequestView
          store={store}
          args={['myInitialArg']}
          dispatch={dispatchSpy}
          fn={fnSpy}
          id="myId"
          render={renderSpy}
        />
      );
    });

    describe('initially', () => {
      it('should call fnSpy with args once', () => {
        expect(fnSpy).toHaveBeenCalledTimes(1);
        expect(fnSpy).toHaveBeenCalledWith('myInitialArg');
      });

      it('should dispatch loading and success states', () => {
        expect(dispatchSpy).toHaveBeenCalledTimes(2);
        expect(dispatchSpy.mock.calls).toEqual([
          [
            {
              args: ['myInitialArg'],
              id: 'myId',
              type: ACTION_TYPES.DID_INIT_REQUEST
            }
          ],
          [
            {
              data: 'myInitialArg',
              args: ['myInitialArg'],
              id: 'myId',
              type: ACTION_TYPES.DID_SUCCEED
            }
          ]
        ]);
      });

      it('should render defaultValue', () => {
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(renderSpy).toHaveBeenCalledWith({});
      });
    });

    describe('when data has loaded', () => {
      beforeEach(() => {
        fnSpy.mockReset();
        dispatchSpy.mockReset();
        renderSpy.mockReset();
        fnSpy.mockImplementation(resolvedPromise);

        const state = {
          reactReduxRequest: {
            myId: {
              status: STATUS.SUCCESS,
              data: 'myData',
              args: ['myInitialArg']
            }
          }
        };

        const store = {
          getState: () => state
        };

        wrapper.setProps({
          args: ['myInitialArg'],
          store,
          selectorResult: state.reactReduxRequest.myId
        });
      });

      it('should not call fnSpy again', () => {
        expect(fnSpy).not.toHaveBeenCalled();
      });

      it('should not call dispatch again', () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should render data', () => {
        expect(renderSpy.mock.calls).toEqual([
          [
            {
              data: 'myData',
              error: undefined,
              status: 'SUCCESS',
              args: ['myInitialArg']
            }
          ]
        ]);
      });
    });
  });

  describe('When mounting with data', () => {
    let fnSpy, renderSpy, dispatchSpy, wrapper;

    beforeEach(() => {
      fnSpy = jest.fn(resolvedPromise);
      renderSpy = jest.fn();
      dispatchSpy = jest.fn();

      const state = {
        reactReduxRequest: {
          myId: {
            status: STATUS.SUCCESS,
            data: 'myData',
            args: ['myInitialArg']
          }
        }
      };

      const store = {
        getState: () => state
      };

      wrapper = shallow(
        <ReactReduxRequestView
          store={store}
          args={['myInitialArg']}
          fn={fnSpy}
          id="myId"
          dispatch={dispatchSpy}
          render={renderSpy}
          selectorResult={state.reactReduxRequest.myId}
        />
      );
    });

    describe('initially', () => {
      it('should not call fnSpy', () => {
        expect(fnSpy).not.toHaveBeenCalled();
      });

      it('should not request new data', () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it('should render SUCCESS', () => {
        expect(renderSpy.mock.calls).toEqual([
          [
            {
              data: 'myData',
              error: undefined,
              status: 'SUCCESS',
              args: ['myInitialArg']
            }
          ]
        ]);
      });
    });

    describe('when args change', () => {
      beforeEach(() => {
        wrapper.setProps({
          args: ['mySecondArg']
        });
      });

      it('should call fnSpy', () => {
        expect(fnSpy).toHaveBeenCalledWith('mySecondArg');
      });

      it('should request new data', () => {
        expect(dispatchSpy.mock.calls).toEqual([
          [
            {
              args: ['mySecondArg'],
              id: 'myId',
              type: ACTION_TYPES.DID_INIT_REQUEST
            }
          ],
          [
            {
              data: 'mySecondArg',
              args: ['mySecondArg'],
              id: 'myId',
              type: ACTION_TYPES.DID_SUCCEED
            }
          ]
        ]);
      });

      it('should render SUCCESS', () => {
        expect(renderSpy.mock.calls).toEqual([
          [{ data: 'myData', status: 'SUCCESS', args: ['myInitialArg'] }],
          [{ data: 'myData', status: 'SUCCESS', args: ['myInitialArg'] }]
        ]);
      });
    });
  });

  describe('when preventFetch is true', () => {
    it('should not call fnSpy', () => {
      const fnSpy = jest.fn(resolvedPromise);
      const store = {
        getState: () => ({
          reactReduxRequest: {}
        })
      };
      shallow(
        <ReactReduxRequestView
          store={store}
          args={['myInitialArg']}
          preventFetch
          fn={fnSpy}
          id="myId"
          dispatch={() => {}}
        />
      );

      expect(fnSpy).not.toHaveBeenCalled();
    });
  });

  describe('when component unmounts', () => {
    it('should dispatch an unmount action', () => {
      const store = {
        getState: () => ({
          reactReduxRequest: {}
        })
      };

      const fnSpy = jest.fn(resolvedPromise);
      const dispatchSpy = jest.fn();
      const wrapper = shallow(
        <ReactReduxRequestView
          store={store}
          args={['myInitialArg']}
          fn={fnSpy}
          id="myId"
          dispatch={dispatchSpy}
        />
      );

      wrapper.unmount();
      expect(dispatchSpy).toHaveBeenCalledWith({
        id: 'myId',
        type: ACTION_TYPES.DID_UNMOUNT
      });
    });
  });
});

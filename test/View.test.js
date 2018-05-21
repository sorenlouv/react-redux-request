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

      wrapper = shallow(
        <ReactReduxRequestView
          args={['myInitialArg']}
          dispatch={dispatchSpy}
          fn={fnSpy}
          didArgsChange={true}
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
              type: ACTION_TYPES.LOADING
            }
          ],
          [
            {
              data: 'myInitialArg',
              args: ['myInitialArg'],
              id: 'myId',
              type: ACTION_TYPES.SUCCESS
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

        wrapper.setProps({
          didArgsChange: false,
          args: ['myInitialArg'],
          selectorResult: {
            status: STATUS.SUCCESS,
            data: 'myData'
          }
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
          [{ data: 'myData', error: undefined, status: 'SUCCESS' }]
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

      wrapper = shallow(
        <ReactReduxRequestView
          args={['myInitialArg']}
          fn={fnSpy}
          didArgsChange={false}
          id="myId"
          dispatch={dispatchSpy}
          render={renderSpy}
          selectorResult={{
            status: STATUS.SUCCESS,
            data: 'myData'
          }}
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
          [{ data: 'myData', error: undefined, status: 'SUCCESS' }]
        ]);
      });
    });

    describe('when args change', () => {
      beforeEach(() => {
        wrapper.setProps({
          didArgsChange: true,
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
              type: ACTION_TYPES.LOADING
            }
          ],
          [
            {
              data: 'mySecondArg',
              args: ['mySecondArg'],
              id: 'myId',
              type: ACTION_TYPES.SUCCESS
            }
          ]
        ]);
      });

      it('should render SUCCESS', () => {
        expect(renderSpy.mock.calls).toEqual([
          [{ data: 'myData', status: 'SUCCESS' }],
          [{ data: 'myData', status: 'SUCCESS' }]
        ]);
      });
    });
  });

  describe('when preventFetch is true', () => {
    it('should not call fnSpy', () => {
      const fnSpy = jest.fn(resolvedPromise);
      shallow(
        <ReactReduxRequestView
          args={['myInitialArg']}
          preventFetch
          fn={fnSpy}
          didArgsChange={true}
          id="myId"
          dispatch={() => {}}
        />
      );

      expect(fnSpy).not.toHaveBeenCalled();
    });
  });

  describe('when component unmounts', () => {
    it('should dispatch an unmount action', () => {
      const fnSpy = jest.fn(resolvedPromise);
      const dispatchSpy = jest.fn();
      const wrapper = shallow(
        <ReactReduxRequestView
          args={['myInitialArg']}
          fn={fnSpy}
          didArgsChange={true}
          id="myId"
          dispatch={dispatchSpy}
        />
      );

      wrapper.unmount();
      expect(dispatchSpy).toHaveBeenCalledWith({
        id: 'myId',
        type: 'REDUX_REQUEST_COMPONENT_UNMOUNT'
      });
    });
  });
});

import { reducer, ACTION_TYPES, STATUS } from '../src/reducer';

const initialSuccessState = {
  myId: {
    args: ['myInitialArg'],
    data: 'myInitialData',
    status: STATUS.SUCCESS
  }
};

const initialFailureState = {
  myId: {
    args: ['myInitialArg'],
    error: 'myInitialFailure',
    status: STATUS.FAILURE
  }
};

describe('reducer', () => {
  it('loading', () => {
    expect(
      reducer(initialSuccessState, {
        id: 'myId',
        args: ['myNextArg'],
        type: ACTION_TYPES.DID_INIT_REQUEST
      })
    ).toEqual({
      myId: {
        args: ['myNextArg'],
        data: 'myInitialData',
        status: 'LOADING'
      }
    });
  });

  it('success', () => {
    expect(
      reducer(initialSuccessState, {
        id: 'myId',
        args: ['myNextArg'],
        data: 'myNextData',
        type: ACTION_TYPES.DID_SUCCEED
      })
    ).toEqual({
      myId: {
        args: ['myNextArg'],
        data: 'myNextData',
        status: 'SUCCESS'
      }
    });
  });

  it('failure', () => {
    expect(
      reducer(initialSuccessState, {
        id: 'myId',
        args: ['myNextArg'],
        error: 'myNextError',
        type: ACTION_TYPES.DID_FAIL
      })
    ).toEqual({
      myId: {
        args: ['myNextArg'],
        error: 'myNextError',
        status: 'FAILURE'
      }
    });
  });

  describe('unmount', () => {
    it('should persist entry when previous action was successful', () => {
      expect(
        reducer(initialSuccessState, {
          id: 'myId',
          type: ACTION_TYPES.DID_UNMOUNT
        })
      ).toEqual({
        myId: {
          args: ['myInitialArg'],
          data: 'myInitialData',
          status: 'SUCCESS'
        }
      });
    });

    it('should remove entry when previous action was failure', () => {
      expect(
        reducer(initialFailureState, {
          id: 'myId',
          type: ACTION_TYPES.DID_UNMOUNT
        })
      ).toEqual({
        myId: {}
      });
    });
  });
});

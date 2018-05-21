import get from 'lodash.get';

export const ACTION_TYPES = {
  LOADING: 'REDUX_REQUEST_LOADING',
  SUCCESS: 'REDUX_REQUEST_SUCCESS',
  FAILURE: 'REDUX_REQUEST_FAILURE',
  UNMOUNT: 'REDUX_REQUEST_COMPONENT_UNMOUNT'
};

export const STATUS = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

export function reducer(state = {}, action = {}) {
  const { args, id, data, error, type } = action;
  switch (type) {
    case ACTION_TYPES.LOADING:
      return {
        ...state,
        [id]: {
          status: STATUS.LOADING,
          data: get(state[id], 'data'),
          error: get(state[id], 'error'),
          args
        }
      };

    case ACTION_TYPES.SUCCESS:
      return {
        ...state,
        [id]: {
          status: STATUS.SUCCESS,
          data,
          args
        }
      };

    case ACTION_TYPES.FAILURE:
      return {
        ...state,
        [id]: {
          status: STATUS.FAILURE,
          error,
          args
        }
      };

    case ACTION_TYPES.UNMOUNT:
      return {
        ...state,
        [id]: get(state[id], 'status') === STATUS.SUCCESS ? state[id] : {}
      };

    default:
      return state;
  }
}

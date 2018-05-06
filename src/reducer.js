import { get } from 'lodash';

export const ACTION_TYPES = {
  LOADING: 'REDUX_REQUEST_LOADING',
  SUCCESS: 'REDUX_REQUEST_SUCCESS',
  FAILURE: 'REDUX_REQUEST_FAILURE'
};

export const STATUS = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

function getStatus(type) {
  switch (type) {
    case ACTION_TYPES.LOADING:
      return STATUS.LOADING;
    case ACTION_TYPES.SUCCESS:
      return STATUS.SUCCESS;
    case ACTION_TYPES.FAILURE:
      return STATUS.FAILURE;
    default:
      throw new Error('Unknown type:', type);
  }
}

export function reduxRequestReducer(state = {}, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING:
    case ACTION_TYPES.SUCCESS:
    case ACTION_TYPES.FAILURE: {
      const { id, data, error, hashedArgs } = action;
      return {
        ...state,
        [id]: {
          status: getStatus(action.type),
          data: data || get(state[id], 'data'),
          error: error || get(state[id], 'error'),
          hashedArgs
        }
      };
    }
    default:
      return state;
  }
}

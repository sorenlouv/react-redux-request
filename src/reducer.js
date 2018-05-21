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

export function reducer(state = {}, action) {
  switch (action.type) {
    case ACTION_TYPES.LOADING:
    case ACTION_TYPES.SUCCESS:
    case ACTION_TYPES.FAILURE: {
      const { id, data, error, args } = action;
      return {
        ...state,
        [id]: {
          status: getStatus(action.type),
          data: data || get(state[id], 'data'),
          error: error || get(state[id], 'error'),
          args
        }
      };
    }
    case ACTION_TYPES.UNMOUNT: {
      const { id } = action;
      return {
        ...state,
        [id]: get(state[id], 'status') === STATUS.SUCCESS ? state[id] : {}
      };
    }
    default:
      return state;
  }
}

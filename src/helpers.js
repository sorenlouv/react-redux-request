import isEqual from 'lodash.isequal';
import get from 'lodash.get';

export const STATE_KEY = 'reactReduxRequest';

function getPrevArgs(state, id) {
  return get(state[STATE_KEY][id], 'args');
}

export function getDidArgsChange(state, args, id) {
  const prevArgs = getPrevArgs(state, id);
  return !isEqual(args, prevArgs);
}

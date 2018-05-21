import { createMockStore } from 'redux-test-utils';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

export function mountWithStore(Component, storeState = {}) {
  const store = createMockStore(storeState);

  const options = {
    context: {
      store
    },
    childContextTypes: {
      store: PropTypes.object.isRequired
    }
  };

  return mount(Component, options);
}

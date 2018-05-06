import React from 'react';
import { storiesOf } from '@storybook/react';
import '@storybook/addon-console';

import SimpleExample from './SimpleExample';
import ArgsExample from './ArgsExample';
import MultiExample from './MultiExample';
import SelectorExample from './SelectorExample';

storiesOf('ReduxRequest', module)
  .add('simple', () => <SimpleExample />)
  .add('with args', () => <ArgsExample />)
  .add('multiple requests', () => <MultiExample />)
  .add('using selectors', () => <SelectorExample />);

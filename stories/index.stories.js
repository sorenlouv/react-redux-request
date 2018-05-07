import React from 'react';
import { storiesOf } from '@storybook/react';

import SimpleExample from './SimpleExample';
import ArgsExample from './ArgsExample';
import MultiExample from './MultiExample';
import SelectorExample from './SelectorExample';
import UnmountExample from './UnmountExample';

storiesOf('ReduxRequest', module)
  .add('simple', () => <SimpleExample />)
  .add('with args', () => <ArgsExample />)
  .add('multiple requests', () => <MultiExample />)
  .add('using selectors', () => <SelectorExample />)
  .add('unmount', () => <UnmountExample />);

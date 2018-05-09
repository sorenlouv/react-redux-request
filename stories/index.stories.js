import React from 'react';
import { storiesOf } from '@storybook/react';

import SimpleExample from './SimpleExample';
import ArgsExample from './ArgsExample';
import MultiExample from './MultiExample';
import SelectorExample from './SelectorExample';
import UnmountExample from './UnmountExample';
import NestedExample from './NestedExample';

storiesOf('ReduxRequest', module)
  .add('simplest', () => <SimpleExample />)
  .add('passing arguments to fn', () => <ArgsExample />)
  .add('multiple components', () => <MultiExample />)
  .add('nested components', () => <NestedExample />)
  .add('using selectors', () => <SelectorExample />)
  .add('behaviour when unmounting component', () => <UnmountExample />);

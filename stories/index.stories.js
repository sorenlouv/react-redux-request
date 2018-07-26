import React from 'react';
import { storiesOf } from '@storybook/react';

import ArgsExample from './ArgsExample';
import IdenticalExample from './IdenticalExample';
import MultiExample from './MultiExample';
import NestedExample from './NestedExample';
import SelectorExample from './SelectorExample';
import SimpleExample from './SimpleExample';
import UnmountExample from './UnmountExample';

storiesOf('Request', module)
  .add('simplest', () => <SimpleExample />)
  .add('passing arguments to fn', () => <ArgsExample />)
  .add('multiple components', () => <MultiExample />)
  .add('identical components', () => <IdenticalExample />)
  .add('nested components', () => <NestedExample />)
  .add('using selectors', () => <SelectorExample />)
  .add('behaviour when unmounting component', () => <UnmountExample />);

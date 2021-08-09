# @nghinv/react-native-swipe-row

React Native Swipe Row Component use reanimated library

---

[![CircleCI](https://circleci.com/gh/nghinv-software/react-native-swipe-row.svg?style=svg)](https://circleci.com/gh/nghinv-software/react-native-swipe-row)
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]
[![All Contributors][all-contributors-badge]][all-contributors]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]

<p align="center">
<img src="./assets/demo.gif" width="300"/>
</p>

## Installation

```sh
yarn add @nghinv/react-native-swipe-row
```

or 

```sh
npm install @nghinv/react-native-swipe-row
```

- peerDependencies

```sh
yarn add react-native-gesture-handler react-native-reanimated
```

## Usage

```js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SwipeRow from '@nghinv/react-native-swipe-row';

function App() {
  return (
    <View style={styles.container}>
      <SwipeRow
        left={[
          { title: 'Delete', backgroundColor: 'tomato' },
          { title: 'Edit', icon: { name: 'delete' } },
        ]}
        right={[
          {
            title: 'Edit',
            titleColor: 'blue',
            backgroundColor: '#b388ff',
            icon: { name: 'edit' },
          },
          {
            title: 'Delete',
            backgroundColor: 'tomato',
            icon: { name: 'delete' },
          },
        ]}
        style={{ marginVertical: 1 }}
      >
        <View style={styles.row}>
          <Text>Swipe Row</Text>
        </View>
      </SwipeRow>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  row: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'steelblue',
  }
});

export default App;
```

# Property

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| left | `Array<ActionType>` | `undefined` |  |
| right | `Array<ActionType>` | `undefined` |  |
| children | `React.ReactNode` | `undefined` |  |
| style | `ViewStyle` | `undefined` |  |
| buttonWidth | `number` | `75` |  |
| autoClose | `boolean` | `true` |  |
| onPress | `() => void` | `undefined` |  |
| onSwipe | `(value: number) => void` | `undefined` |  |
| activeRow | `Animated.SharedValue<number>` | `undefined` |  |
| rowIndex | `number` | `-1` |  |
| disabled | `boolean` | `false` |  |


- **ActionType**

| Property | Type | Default | Description |
|----------|:----:|:-------:|-------------|
| icon | `IconPropsType` | `undefined` |  |
| title | `string` | `undefined` |  |
| titleColor | `string` | `undefined` |  |
| titleStyle | `TextStyle` | `undefined` |  |
| onPress | `() => void` | `undefined` |  |
| backgroundColor | `string` | `undefined` |  |

---
## Credits

- [@Nghi-NV](https://github.com/Nghi-NV)

[version-badge]: https://img.shields.io/npm/v/@nghinv/react-native-swipe-row.svg?style=flat-square
[package]: https://www.npmjs.com/package/@nghinv/react-native-swipe-row
[license-badge]: https://img.shields.io/npm/l/@nghinv/react-native-swipe-row.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[all-contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square
[all-contributors]: #contributors
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com

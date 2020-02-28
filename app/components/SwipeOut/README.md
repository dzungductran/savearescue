# react-native-swipeout

iOS-style swipeout buttons that appear from behind a component

Original package [here](https://github.com/dancormier/react-native-swipeout)

## Why forked?
The problem is that I need a possibility to tap on the `Swipeout` and it must be opened. The original package does not provide such functionality.

I have found [this](https://github.com/dancormier/react-native-swipeout/issues/118) issue. [@alburdette619](https://github.com/alburdette619) made a fork and his solution worked... With old `react-native` versions.

I just added `prop-types` and `create-react-class` to dependencies in order to run this package with 0.50+ version of `react-native`. That\`s all. And a bit of refactoring.

This is how it works:

![swipeout preview](https://i.imgur.com/QcNDopj.gif)

## Installation
```
yarn add git+https://github.com/CandyOgre/react-native-swipeout.git
```

## Usage example

```
import React from 'react';
import Swipeout from 'react-native-swipeout';

// Buttons
const swipeoutBtns = [
  {
    text: 'Button'
  }
]

class SwipeoutComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
    };
  }

  render() {
    return (
      <Swipeout
        right={swipeoutBtns}
        autoClose
        onClose={() => this.setState({ opened: false })}
        openRight={this.state.opened}
        sensitivity={200}
      >
        <View style={{ height: 50 }}>
          <TouchableWithoutFeedback onPress={() => {
            this.setState({ opened: true });
          }}
          >
            
            <View style={{ flex: 1 }}>
              <Text>Touch me, touch me</Text>
            </View>
            
          </TouchableWithoutFeedback>
        </View>

      </Swipeout>
    );
  }
}

```

## Props

Prop            | Type   | Optional | Default   | Description
--------------- | ------ | -------- | --------- | -----------
autoClose       | bool   | Yes      | false     | auto close on button press
backgroundColor | string | Yes      | '#dbddde' |
close           | bool   | Yes      |           | close swipeout
disabled        | bool   | Yes      |  false    | whether to diable the swipeout  
left            | array  | Yes      | []        | swipeout buttons on left
onOpen          | func   | Yes      |           | (sectionID, rowId, direction: string) => void
onClose          | func   | Yes      |           | (sectionID, rowId, direction: string) => void
right           | array  | Yes      | []        | swipeout buttons on right
scroll          | func   | Yes      |           | prevent parent scroll
style           | style  | Yes      |           | style of the container
sensitivity     | number | Yes      | 50         | change the sensitivity of gesture
buttonWidth     | number | Yes      |            | each button width

##### Button props

Prop            | Type   | Optional | Default   | Description
--------------- | ------ | -------- | --------- | -----------
backgroundColor | string | Yes      | '#b6bec0' | background color
color           | string | Yes      | '#ffffff' | text color
component       | string | Yes      | null      | pass custom component to button
onPress         | func   | Yes      | null      | function executed onPress
text            | string | Yes      | 'Click Me'| text
type            | string | Yes      | 'default' | default, primary, secondary
underlayColor   | string | Yes      | null      | button underlay color on press
disabled        | bool   | Yes      | false     | disable button

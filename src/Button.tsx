/**
 * Created by nghinv on Sun Jun 20 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React from 'react';
import { Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Icon, IconPropsType } from '@nghinv/react-native-icons';
import equals from 'react-fast-compare';

export type ActionType = {
  icon?: IconPropsType;
  title?: string;
  titleColor?: string;
  titleStyle?: TextStyle;
  onPress?: () => void;
  backgroundColor?: string;
  testID?: string;
  accessibilityLabel?: string;
};

interface ButtonProps {
  content: ActionType;
  width: number;
  index: number;
  translateX: Animated.SharedValue<number>;
  maxTranslate: number;
  type: 'left' | 'right';
  onPress: () => void;
  length: number;
}

const space = 5;

function Button(props: ButtonProps) {
  const {
    content,
    width,
    index,
    translateX,
    maxTranslate,
    type,
    onPress,
    length,
  } = props;
  const backgroundColor = content.backgroundColor || '#b388ff';
  const titleColor = content.titleColor || 'white';

  const contentStyle = useAnimatedStyle(() => {
    const delta = Math.abs(translateX.value) - maxTranslate;

    if (type === 'right') {
      return {
        position: 'absolute',
        flex: 0,
        top: 0,
        bottom: 0,
        right: delta > 0 ? -(width + delta / length + space) : -width,
        width: delta > 0 ? width + delta / length + space : width,
        transform: [
          {
            translateX: interpolate(
              translateX.value,
              [-maxTranslate, 0],
              [-width * index, 0],
              Extrapolate.EXTEND
            ),
          },
        ],
      };
    }

    return {
      position: 'absolute',
      flex: 0,
      alignItems: 'flex-end',
      top: 0,
      bottom: 0,
      left: delta > 0 ? -(width + delta / length + space) : -width,
      width: delta > 0 ? width + delta / length + space : width,
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [0, maxTranslate],
            [0, width * index],
            Extrapolate.EXTEND
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[{ backgroundColor }, contentStyle]}>
      <TouchableOpacity
        onPress={onPress}
        testID={content.testID}
        accessibilityLabel={content.accessibilityLabel}
        style={[styles.container, { width }]}
      >
        {content.icon && <Icon color="white" size={24} {...content.icon} />}
        {!!content.title && (
          <Text
            style={[
              styles.title,
              // eslint-disable-next-line react-native/no-inline-styles
              { color: titleColor, marginTop: content.icon ? 2 : 0 },
              content.titleStyle,
            ]}
          >
            {content.title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 14,
  },
});

export default React.memo(Button, equals);

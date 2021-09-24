/**
 * Created by nghinv on Fri Jun 18 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, {
  forwardRef,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import equals from 'react-fast-compare';
import Button, { ActionType } from './Button';

type ButtonComponentProps = React.ElementType &
  (typeof TouchableOpacity | typeof View);

type ContextX = {
  x: number;
};

export const State = {
  left: -1,
  swipeLeft: -2,
  swipeRight: 2,
  right: 1,
  normal: 0,
  swipeNormal: 100,
};

interface SwipeRowProps {
  left?: Array<ActionType>;
  right?: Array<ActionType>;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  buttonWidth?: number;
  autoClose?: boolean;
  onPress?: () => void;
  onSwipe?: (value: number) => void;
  activeRow?: Animated.SharedValue<number>;
  rowIndex?: number;
  disabled?: boolean;
  disabledOpacity?: number;
  testID?: string;
  accessibilityLabel?: string;
}

export const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>
): number => {
  'worklet';

  const point = value + 0.2 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter((p) => Math.abs(point - p) === minDelta)[0];
};

const springConfig = (velocity: number) => {
  'worklet';

  return {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    velocity,
  };
};

const timingConfig = {
  duration: 400,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

function SwipeRow(props: SwipeRowProps, ref: React.Ref<any>) {
  const {
    children,
    left,
    right,
    style,
    buttonWidth = 75 as number,
    autoClose = true,
    disabled = false,
    onPress,
    onSwipe,
    testID,
    accessibilityLabel,
    rowIndex = -1,
    disabledOpacity = 0.6,
  } = props;
  const ButtonComponent: ButtonComponentProps =
    disabled || !onPress ? View : TouchableOpacity;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const activeRow = props.activeRow || useSharedValue(-1);
  const translateX = useSharedValue(0);
  const minTranslateX = useRef(0);
  const maxTranslateX = useRef(0);
  const contentLayout = {
    width: useSharedValue(0),
    height: useSharedValue(0),
  };
  const state = useSharedValue(State.normal);
  const swipeEnable =
    !disabled &&
    ((left?.length as number) > 0 || (right?.length as number) > 0);
  const snapPoints: Array<number> = [0];
  if (left?.length && left.length > 0) {
    const translateWith = left.length * buttonWidth;
    snapPoints.push(translateWith);
    maxTranslateX.current = translateWith;
  }
  if (right?.length && right.length > 0) {
    const translateWith = -right.length * buttonWidth;
    snapPoints.push(translateWith);
    minTranslateX.current = translateWith;
  }

  const onLayout = (event: LayoutChangeEvent) => {
    contentLayout.width.value = event.nativeEvent.layout.width;
    contentLayout.height.value = event.nativeEvent.layout.height;
  };

  const onButtonPress = (content: any) => {
    if (autoClose) {
      translateX.value = withTiming(0, timingConfig, () => {
        state.value = State.normal;
      });
    }
    content?.onPress?.();
  };

  const onPressRow = () => {
    if (autoClose) {
      translateX.value = withTiming(0, timingConfig, () => {
        state.value = State.normal;
      });
    }
    onPress?.();
  };

  const closeRow = useCallback(() => {
    translateX.value = withTiming(0, { ...timingConfig, duration: 250 }, () => {
      state.value = State.normal;
    });
  }, [translateX, state]);

  useImperativeHandle(ref, () => ({
    close: () => {
      closeRow();
    },
    getState: () => {
      return state.value;
    },
  }));

  const onSwipeRow = (value: number) => {
    onSwipe?.(value);
  };

  useAnimatedReaction(
    () => {
      return activeRow.value;
    },
    (newValue) => {
      if (newValue !== -1 && newValue !== rowIndex) {
        runOnJS(closeRow)();
      }
    }
  );

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextX
  >({
    onStart: (_, ctx) => {
      activeRow.value = rowIndex;
      ctx.x = translateX.value;
      runOnJS(onSwipeRow)(state.value);
    },
    onActive: (event, ctx) => {
      const nextTranslate = event.translationX + ctx.x;
      if (state.value === State.swipeLeft && nextTranslate < 0) {
        translateX.value = 0;
        return;
      }
      if (state.value === State.swipeRight && nextTranslate > 0) {
        translateX.value = 0;
        return;
      }

      // eslint-disable-next-line prettier/prettier
      state.value = nextTranslate > 0 ? State.swipeLeft : nextTranslate < 0 ? State.swipeRight : State.swipeNormal;

      if (nextTranslate > maxTranslateX.current) {
        translateX.value =
          maxTranslateX.current + (nextTranslate - maxTranslateX.current) * 0.1;
      } else if (nextTranslate < minTranslateX.current) {
        translateX.value =
          minTranslateX.current + (nextTranslate - minTranslateX.current) * 0.1;
      } else {
        translateX.value = nextTranslate;
      }
    },
    onFinish: (event) => {
      let snapTo = snapPoint(translateX.value, event.velocityX, snapPoints);
      if (
        (state.value === State.swipeLeft && snapTo < 0) ||
        (state.value === State.swipeRight && snapTo > 0)
      ) {
        snapTo = 0;
      }
      state.value =
        snapTo > 0 ? State.left : snapTo < 0 ? State.right : State.normal;

      translateX.value = withSpring(snapTo, springConfig(event.velocityX));
    },
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const leftButtonStyle = useAnimatedStyle(() => {
    const checkTranslate =
      translateX.value > 0 && state.value !== State.swipeRight;
    return {
      left: 0,
      height: contentLayout.height.value,
      width: checkTranslate ? translateX.value : 0,
    };
  });

  const rightButtonStyle = useAnimatedStyle(() => {
    const checkTranslate =
      translateX.value < 0 && state.value !== State.swipeLeft;
    return {
      right: 0,
      height: contentLayout.height.value,
      width: checkTranslate ? -translateX.value : 0,
    };
  });

  return (
    <View style={style}>
      <View style={styles.viewActions}>
        {left && (
          <Animated.View style={[styles.button, leftButtonStyle]}>
            {left?.reverse().map((content, index) => (
              <Button
                key={index}
                content={content}
                width={buttonWidth}
                index={left.length - index}
                translateX={translateX}
                length={left.length}
                maxTranslate={left.length * buttonWidth}
                type="left"
                onPress={() => onButtonPress(content)}
              />
            ))}
          </Animated.View>
        )}
        {right && (
          <Animated.View style={[styles.button, rightButtonStyle]}>
            {right?.map((content, index) => (
              <Button
                key={index}
                content={content}
                width={buttonWidth}
                index={right.length - index}
                translateX={translateX}
                length={right.length}
                maxTranslate={right.length * buttonWidth}
                type="right"
                onPress={() => onButtonPress(content)}
              />
            ))}
          </Animated.View>
        )}
      </View>
      <PanGestureHandler
        enabled={swipeEnable}
        onGestureEvent={onGestureEvent}
        activeOffsetX={[-10, 10]}
        shouldCancelWhenOutside
      >
        <Animated.View
          onLayout={onLayout}
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          // eslint-disable-next-line react-native/no-inline-styles
          style={[{ opacity: disabled ? disabledOpacity : 1 }, contentStyle]}
        >
          <ButtonComponent onPress={onPressRow}>{children}</ButtonComponent>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  viewActions: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

export default React.memo(forwardRef(SwipeRow), equals);

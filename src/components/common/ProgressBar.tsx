import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { THEME } from '../../constants';

interface ProgressBarProps {
  progress: number; // 0 to 1 or 0 to 100
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = THEME.colors.primary,
  backgroundColor = THEME.colors.surfaceBorder,
  height = 8,
  style,
}) => {
  // Normalize progress to percentage 0 - 100
  const percent = Math.min(100, Math.max(0, progress > 1 ? progress : progress * 100));
  const width = useSharedValue(percent);

  useEffect(() => {
    width.value = withTiming(percent, { duration: 350 });
  }, [percent, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      style={[styles.container, { height, backgroundColor, borderRadius: height / 2 }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percent) }}
    >
      <Animated.View
        style={[styles.fill, { backgroundColor: color, borderRadius: height / 2 }, fillStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

import React, { useEffect } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../context';

interface ProgressBarProps {
  progress: number; // 0 to 1 or 0 to 100
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  backgroundColor,
  height = 8,
  style,
}) => {
  const { colors } = useTheme();
  // Normalize progress to percentage 0 - 100
  const percent = Math.min(100, Math.max(0, progress > 1 ? progress : progress * 100));
  const width = useSharedValue(percent);

  useEffect(() => {
    width.value = withTiming(percent, { duration: 350 });
  }, [percent, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      style={[styles.container, { height, backgroundColor: backgroundColor ?? colors.surfaceBorder, borderRadius: height / 2 }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percent) }}
    >
      <Animated.View
        style={[styles.fill, { backgroundColor: color ?? colors.primary, borderRadius: height / 2 }, fillStyle]}
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

import React from 'react';
import type { Preview } from '@storybook/react';
import { View } from 'react-native';
import { colors } from '../src/theme/colors';

const preview: Preview = {
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: colors.background }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

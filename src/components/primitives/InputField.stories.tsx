import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './InputField';

const meta: Meta<typeof InputField> = { title: 'Primitives/InputField', component: InputField };
export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = { args: { label: 'Email', value: '', onChangeText: () => {} } };
export const WithError: Story = {
  args: { label: 'Email', value: 'invalid', onChangeText: () => {}, error: 'Enter a valid email' },
};
export const Password: Story = {
  args: { label: 'Password', value: 'geheim123', onChangeText: () => {}, secureTextEntry: true },
};
export const Required: Story = {
  args: { label: 'Naam', value: '', onChangeText: () => {}, required: true },
};

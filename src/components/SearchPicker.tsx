import { colors } from '../theme/colors';
import type { IconName } from './primitives/Icon';
import { InputField } from './primitives/InputField';
import { Spinner } from './primitives/Spinner';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';
import { ChoiceCard } from './ChoiceCard';

export interface PickerOption {
  id: string;
  title: string;
  subtitle?: string;
}

interface SearchPickerProps {
  label: string;
  required?: boolean;
  placeholder: string;
  query: string;
  onQueryChange: (query: string) => void;
  results: PickerOption[];
  isSearching: boolean;
  error?: string;
  icon: IconName;
  inputIcon: IconName;
  onSelect: (id: string) => void;
  addLabel: string;
  onAdd: () => void;
  testID: string;
}

export function SearchPicker({
  label,
  required = false,
  placeholder,
  query,
  onQueryChange,
  results,
  isSearching,
  error,
  icon,
  inputIcon,
  onSelect,
  addLabel,
  onAdd,
  testID,
}: SearchPickerProps) {
  const hasQuery = query.trim().length >= 2;

  return (
    <Stack gap="sm">
      <InputField
        label={label}
        showLabel={required}
        required={required}
        variant="pill"
        icon={inputIcon}
        value={query}
        onChangeText={onQueryChange}
        placeholder={placeholder}
        autoCapitalize="words"
        testID={`${testID}-search`}
      />
      {isSearching && <Spinner color={colors.accent} />}
      {error !== undefined && <Text color={colors.error}>{error}</Text>}
      {results.map((option) => (
        <ChoiceCard
          key={option.id}
          title={option.title}
          subtitle={option.subtitle}
          icon={icon}
          onPress={() => onSelect(option.id)}
          testID={`${testID}-result`}
        />
      ))}
      {hasQuery && !isSearching && (
        <ChoiceCard
          title={addLabel}
          subtitle={`“${query.trim()}”`}
          icon="add"
          onPress={onAdd}
          testID={`${testID}-add`}
        />
      )}
    </Stack>
  );
}

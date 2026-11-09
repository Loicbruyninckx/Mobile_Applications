import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { useAuthStore } from '../src/state/useAuthStore';
import { Badge } from '../src/components/primitives/Badge';
import { InputField } from '../src/components/primitives/InputField';
import { Row } from '../src/components/primitives/Row';
import { Screen } from '../src/components/primitives/Screen';
import { Stack } from '../src/components/primitives/Stack';
import { Text } from '../src/components/primitives/Text';
import { BackButton } from '../src/components/BackButton';
import { LoginHero } from '../src/components/LoginHero';
import { StyledButton } from '../src/components/StyledButton';
import { TextLink } from '../src/components/TextLink';
import { colors } from '../src/theme/colors';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading, isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />;

  const isRegister = mode === 'register';

  const switchMode = () => {
    setError('');
    setMode(isRegister ? 'login' : 'register');
  };

  const handleSubmit = async () => {
    setError('');
    if (email.trim() === '' || password === '' || (isRegister && username.trim() === '')) {
      setError('Vul alle velden in.');
      return;
    }
    try {
      if (isRegister) {
        await register(email, password, username);
      } else {
        await login(email, password);
      }
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis. Probeer opnieuw.');
    }
  };

  return (
    <Screen padding="lg">
      <Stack flex={1} gap="lg" justify="space-between">
        <Stack gap="lg">
          {isRegister ? (
            <>
              <Row>
                <BackButton onPress={switchMode} label="Terug naar inloggen" />
              </Row>
              <Text size="xxl" weight="bold">
                Join de <Text size="xxl" weight="bold" color={colors.accent}>crew.</Text>
              </Text>
            </>
          ) : (
            <>
              <Row justify="space-between">
                <Badge label="BIERAPP" />
                <Text color={colors.textSecondary}>18+</Text>
              </Row>
              <LoginHero />
              <Text size="xxl" weight="bold">
                Wat drink jij{'\n'}
                <Text size="xxl" weight="bold" color={colors.accent}>vanavond?</Text>
              </Text>
            </>
          )}

          {isRegister && (
            <InputField
              label="Gebruikersnaam"
              value={username}
              onChangeText={setUsername}
              placeholder="bv. loic_b"
              testID="username-input"
            />
          )}
          <InputField
            label="E-mailadres"
            value={email}
            onChangeText={setEmail}
            placeholder="naam@voorbeeld.be"
            keyboardType="email-address"
            testID="email-input"
          />
          <InputField
            label="Wachtwoord"
            value={password}
            onChangeText={setPassword}
            placeholder={isRegister ? 'minstens 6 tekens' : '••••••••'}
            secureTextEntry
            testID="password-input"
          />
          {error !== '' && (
            <Text color={colors.error} testID="login-error">
              {error}
            </Text>
          )}
        </Stack>

        <Stack gap="sm">
          <StyledButton
            label={isRegister ? 'Account maken' : 'Inloggen'}
            onPress={handleSubmit}
            isLoading={isLoading}
            size="lg"
            testID={isRegister ? 'register-button' : 'login-button'}
          />
          <TextLink
            prefix={isRegister ? 'Al een account?' : 'Nieuw hier?'}
            label={isRegister ? 'Inloggen' : 'Maak een account'}
            onPress={switchMode}
            testID="switch-mode-button"
          />
        </Stack>
      </Stack>
    </Screen>
  );
}

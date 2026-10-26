import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { useAuthStore } from '../src/state/useAuthStore';
import { InputField } from '../src/components/primitives/InputField';
import { Screen } from '../src/components/primitives/Screen';
import { Stack } from '../src/components/primitives/Stack';
import { Text } from '../src/components/primitives/Text';
import { StyledButton } from '../src/components/StyledButton';

type Mode = 'login' | 'register';

const ERROR_COLOR = '#B3261E';

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading, isAuthenticated } = useAuthStore();

  // Al ingelogd (bv. sessie hersteld)? Dan meteen naar home.
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
      <Stack gap="lg">
        <Text size="xl" weight="bold" align="center">
          {isRegister ? 'Account maken' : 'Welkom terug'}
        </Text>
        {isRegister && (
          <InputField
            label="Gebruikersnaam"
            value={username}
            onChangeText={setUsername}
            placeholder="bv. loic"
            testID="username-input"
          />
        )}
        <InputField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="jij@voorbeeld.be"
          testID="email-input"
        />
        <InputField
          label="Wachtwoord"
          value={password}
          onChangeText={setPassword}
          placeholder={isRegister ? 'Minstens 6 tekens' : undefined}
          secureTextEntry
          testID="password-input"
        />
        {error !== '' && (
          <Text size="sm" color={ERROR_COLOR} testID="login-error">
            {error}
          </Text>
        )}
        <StyledButton
          label={isRegister ? 'Registreren' : 'Inloggen'}
          onPress={handleSubmit}
          isLoading={isLoading}
          testID={isRegister ? 'register-button' : 'login-button'}
        />
        <StyledButton
          label={isRegister ? 'Ik heb al een account' : 'Nog geen account? Registreer'}
          onPress={switchMode}
          variant="secondary"
          testID="switch-mode-button"
        />
      </Stack>
    </Screen>
  );
}

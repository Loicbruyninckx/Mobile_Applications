import { defineConfig } from 'cypress';
import { registerSupabaseTasks } from './cypress/tasks/supabaseTasks';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081',
    // Supabase en de debounce van het zoekveld hebben soms wat tijd nodig.
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      registerSupabaseTasks(on, config);
      return config;
    },
  },
});

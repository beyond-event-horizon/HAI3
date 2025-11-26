/**
 * HAI3 Application Component
 *
 * This component returns null because HAI3Provider renders AppRouter internally.
 * The App component exists as the conventional entry point for:
 * - Future app-specific configuration
 * - Additional providers or context (if needed)
 *
 * HAI3Provider (in main.tsx) handles:
 * - Redux Provider setup
 * - AppRouter with dynamic routing
 * - RouterSync (URL ↔ Redux)
 *
 * Framework handles everything else:
 * - Footer discovers registered themes/screensets
 * - Navigation events switch screensets automatically
 * - Routes sync lazily from registered screensets
 * - Menu displays logo and handles expand/collapse
 */

function App() {
  return null;
}

export default App;

# @pollar/react-native

React Native bindings for [Pollar](https://pollar.xyz) — drop-in authentication UI and hooks for Stellar-based mobile applications.

## Installation

```bash
npm install @pollar/react-native @pollar/core
# or
pnpm add @pollar/react-native @pollar/core
# or
yarn add @pollar/react-native @pollar/core
```

**Peer dependencies:** `react >= 18`, `react-native >= 0.72`

## Quick Start

Wrap your application with `PollarProvider` and use the `usePollar` hook anywhere in the tree.

```tsx
import { PollarProvider } from '@pollar/react-native';

export default function App() {
  return (
    <PollarProvider config={{ apiKey: 'your-api-key' }}>
      <MyApp />
    </PollarProvider>
  );
}
```

```tsx
import { usePollar } from '@pollar/react-native';

export function Profile() {
  const { isAuthenticated, walletAddress, login, logout } = usePollar();

  if (!isAuthenticated) {
    return (
      <TouchableOpacity onPress={() => login({ provider: 'google' })}>
        <Text>Sign in with Google</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      <Text>Wallet: {walletAddress}</Text>
      <TouchableOpacity onPress={logout}><Text>Sign out</Text></TouchableOpacity>
    </View>
  );
}
```

## API Reference

### `<PollarProvider>`

Context provider that initialises the Pollar client and makes it available to child components.

```tsx
<PollarProvider
  config={{
    apiKey: 'your-api-key',
    baseUrl: 'https://sdk.api.pollar.xyz', // optional
    stellarNetwork: 'testnet',             // optional, default: 'testnet'
  }}
>
  {children}
</PollarProvider>
```

| Prop     | Type                | Required | Description                              |
| -------- | ------------------- | -------- | ---------------------------------------- |
| `config` | `PollarClientConfig`| Yes      | Configuration passed to `PollarClient`   |
| `styles` | `PollarStyles`      | No       | Style overrides (theme, accent, providers) |

---

### `usePollar()`

Returns the authentication and SDK context.

```ts
const {
  isAuthenticated,  // boolean — true when a valid session exists
  walletAddress,    // string — public key of the authenticated wallet
  login,            // (options: PollarLoginOptions) => void
  logout,           // () => void
  buildTx,          // (operation, params, options?) => Promise<void>
  signAndSubmitTx,  // (unsignedXdr: string) => Promise<void>
  transaction,      // TransactionState — current transaction state
  txHistory,        // TxHistoryState — transaction history
  network,          // StellarNetwork — current network
  setNetwork,       // (network: StellarNetwork) => void
  getClient,        // () => PollarClient
  config,           // PollarConfig — remote app configuration
  styles,           // PollarStyles — resolved styles
  openLoginModal,
  openTransactionModal,
  openKycModal,
  openRampWidget,
  openTxHistoryModal,
  openWalletBalanceModal,
} = usePollar();
```

#### Login options

```ts
// Social providers (opens browser via Linking)
login({ provider: 'google' });
login({ provider: 'github' });

// Email OTP
login({ provider: 'email', email: 'user@example.com' });

// Stellar wallet
import { WalletType } from '@pollar/core';
login({ provider: 'wallet', type: WalletType.FREIGHTER });
login({ provider: 'wallet', type: WalletType.ALBEDO });
```

---

### `<WalletButton>`

Pre-built button component that opens the Pollar authentication modal.

```tsx
import { WalletButton } from '@pollar/react-native';

export function Header() {
  return <WalletButton />;
}
```

The modal handles all login providers, loading states, and error feedback out of the box.

---

### Requirement step modals

`<RampWidget>` lists a route whose corridor has a pending requirement step as locked and opens that step itself. The
same modals are exported for apps that build their own route list from the quote's `requirementsRequired`:

| Component                     | Step                    | Props                                                        |
| ----------------------------- | ----------------------- | ------------------------------------------------------------ |
| `<RequirementFormModal>`      | `FORM`                  | `formId`, `progress?`, `onClose`, `onSubmitted`              |
| `<RegistryCheckModal>`        | `REGISTRY_CHECK` (SEGIP) | `optionId`, `progress?`, `onClose`, `onApproved`            |
| `<ProviderRegistrationModal>` | `PROVIDER_REGISTRATION` | `corridorId`, `progress?`, `onClose`, `onRegistered`         |

`progress` is `{ position, total }` from the quote, shown as "Step n of total". The form modal prefills the user's
previous answers; the registry modal prefills the verified identity and lets the user edit only the surname split and the
CI complement; the registration modal lists what the provider receives and sends it on consent.

```tsx
import { RegistryCheckModal } from '@pollar/react-native';

<RegistryCheckModal optionId={step.optionId} progress={{ position: 2, total: 4 }} onClose={close} onApproved={requote} />
```

---

## Styles

No CSS import is needed. All components use React Native `StyleSheet` and are styled natively. Appearance is controlled via the `styles` prop on `<PollarProvider>`.

---

## TypeScript

`@pollar/react-native` ships full type support. Key exported types:

```ts
import type {
  AuthProviderProps,
  AuthContextValue,
  LoginButtonProps,
  AuthModalProps,
  PollarConfig,
  PollarStyles,
} from '@pollar/react-native';
```

---

## License

MIT


export interface NetworkInfo {
  id: number;
  type: string;
}

export interface AccountAddress {
  address: string;
}

interface RequestArguments {
  readonly method: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly params?: readonly unknown[] | object;
}

interface ProviderMessage {
  readonly type: string;
  readonly data: unknown;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface ProviderConnectInfo {
  readonly chainId: string;
}

interface EthereumEvent {
  connect: ProviderConnectInfo;
  disconnect: ProviderRpcError;
  accountsChanged: Array<string>;
  chainChanged: string;
  message: ProviderMessage;
}

type EventKeys = keyof EthereumEvent;
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void;

export interface Ethereumish {
  autoRefreshOnNetworkChange: boolean;
  chainId: string;
  isMetaMask?: boolean;
  isStatus?: boolean;
  networkVersion: string;
  selectedAddress: unknown;
  isConnected: () => boolean;

  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void;
  enable(): Promise<never>;
  request: (request: {
    method: string;
    params?: Array<never>;
  }) => Promise<never>;
  /**
   * @deprecated
   */
  send?: (
    request: { method: string; params?: Array<never> },
    callback: (error: never, response: never) => void
  ) => void;
  sendAsync: (request: RequestArguments) => Promise<unknown>;
}

export interface UserStateInterface {
  isConnected: boolean;
  account?: string;
  error?: Error;
  networkInfo?: NetworkInfo;
  profile: [];
  userAccount?: string;
  userProfile: [];
}

export interface IWeb3Provider {
  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: (payload: any) => Promise<never>;
}

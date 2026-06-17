// Public exports for the DreamerOS connector schema package.
export type {
  ConnectorCategory,
  ConnectorAuthMode,
  ConnectorStatus,
  ProviderTier,
  ConnectionHealth,
  Provider,
} from "./provider.js";

export {
  providerIconUrl,
  tierRank,
  mapToProviderTier,
  userMeetsTier,
  getProvidersByCategory,
  getProviderById,
} from "./provider.js";

export type {
  OAuthStartResponse,
  OAuthCallbackQuery,
  PasteTokenRequest,
  PasteTokenResponse,
  IntegrationHealthResponse,
  IntegrationConnection,
  IntegrationConnectionsResponse,
  DisconnectResponse,
  SyncTriggerResponse,
  IntegrationRun,
  IntegrationRunsResponse,
  IntegrationShellResponse,
} from "./gateway-contract.js";

export type { ValidationResult } from "./validate.js";
export { validateConnector, validateRegistry } from "./validate.js";

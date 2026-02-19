export type ArchitecturePattern = "hexagonal";
export type ClientArchitecturePattern =
  | "horizontal-slice"
  | "clean-architecture";
export type ApiFramework = "hono" | "express" | "fastify" | "go";
export type ClientFramework = "tanstack-router";
export type Framework = ApiFramework | ClientFramework;
export type InboundAdapter = "http" | "websocket";
export type OutboundAdapter = "in-memory" | "database" | "cache";

export interface TemplateData {
  name: string;
  capitalizedName: string;
  camelCaseName: string;
  pluralName: string;
  kebabName: string;
  architecture: ArchitecturePattern;
  framework: Framework;
  inboundAdapters: InboundAdapter[];
  outboundAdapters: OutboundAdapter[];
}

export interface ClientTemplateData {
  resourceName: string;
  ResourceName: string;
  pluralName: string;
  PluralName: string;
  framework: ClientFramework;
  outputDir: string;
}

export interface ExistingResourceInfo {
  name: string;
  path: string;
  architecture: ArchitecturePattern;
  framework: Framework;
  hasHttp: boolean;
  hasWebSocket: boolean;
  hasInMemory: boolean;
  hasDatabase: boolean;
  hasCache: boolean;
}

export interface FileToGenerate {
  path: string;
  content: string;
  layer: string;
}

// --- Monorepo generation types ---

export type InfraPackage = "db" | "db-turso" | "cache" | "event-driven" | "auth" | "pwa" | "s3";

export interface MonorepoTemplateData {
  projectName: string;
  scope: string;
  kebabName: string;
  frameworks: Framework[];
  apiFramework: ApiFramework;
  infraPackages: InfraPackage[];
  hasDb: boolean;
  hasDbTurso: boolean;
  hasCache: boolean;
  hasEventDriven: boolean;
  hasAuth: boolean;
  hasClient: boolean;
  hasPwa: boolean;
  hasS3: boolean;
}

export interface MonorepoFileToGenerate {
  path: string;
  content: string;
  description: string;
}

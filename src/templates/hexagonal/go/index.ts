// Domain Layer
export { generateGoEntityTemplate } from "./entity.template";

// Application Layer - Ports
export { generateGoUseCasePortTemplate } from "./use-case-port.template";
export { generateGoRepositoryPortTemplate } from "./repository-port.template";

// Application Layer - Use Cases
export { generateGoUseCaseTemplate } from "./use-case.template";
export { generateGoUseCaseTestTemplate } from "./use-case-test.template";

// Adapters - Outbound (Persistence)
export { generateGoInMemoryRepositoryTemplate } from "./in-memory-repository.template";
export { generateGoDatabaseRepositoryTemplate } from "./database-repository.template";
export { generateGoCacheRepositoryTemplate } from "./cache-repository.template";

// Adapters - Inbound (HTTP)
export { generateGoHandlerTemplate } from "./handler.template";
export { generateGoValidationTemplate } from "./validation.template";
export { generateGoRoutesTemplate } from "./routes.template";
export { generateGoRoutesTestTemplate } from "./routes-test.template";

// Composition Root
export { generateGoCompositionRootTemplate } from "./composition-root.template";

// Configuration
export { generateGoConfigTemplate } from "./config.template";

// Project Files
export { generateGoModuleTemplate } from "./go-mod.template";
export { generateGoMainTemplate } from "./main.template";
export { generateGoDockerfileTemplate } from "./dockerfile.template";
export { generateGoDockerComposeTemplate } from "./docker-compose.template";
export { generateGoMakefileTemplate } from "./makefile.template";
export { generateGoReadmeTemplate } from "./readme.template";
export { generateGoEnvExampleTemplate } from "./env-example.template";
export { generateGoGitignoreTemplate } from "./gitignore.template";

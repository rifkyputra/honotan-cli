import type { TemplateData } from "../../../types";

export function generateGoCompositionRootTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, outboundAdapters } = data;
  const hasDatabase = outboundAdapters?.includes('database');
  const hasCache = outboundAdapters?.includes('cache');

  const baseRepoType = hasDatabase ? `Database${capitalizedName}Repository` : `InMemory${capitalizedName}Repository`;
  
  let imports = [
    `"${data.name}/application/use-cases"`,
    `httpAdapter "${data.name}/adapters/in/http"`,
  ];

  if (hasDatabase) {
    imports.push(`"${data.name}/adapters/out/persistence"`);
  } else {
    imports.push(`"${data.name}/adapters/out/persistence"`);
  }

  if (hasCache) {
    imports.push(`"${data.name}/adapters/out/cache"`);
  }

  let setupCode = `	// Outbound adapters (persistence)
	baseRepository := persistence.New${baseRepoType}()
`;

  if (hasCache) {
    setupCode += `	
	// Wrap with cache if needed
	repository := cache.NewCached${capitalizedName}Repository(baseRepository)
`;
  } else {
    setupCode += `	repository := baseRepository
`;
  }

  setupCode += `
	// Application layer (use cases)
	${camelCaseName}UseCases := usecases.New${capitalizedName}UseCases(repository)

	// Inbound adapters (HTTP routes)
	return httpAdapter.Create${capitalizedName}Routes(${camelCaseName}UseCases)`;

  return `package composition

import (
	${imports.join('\n\t')}
	"github.com/go-chi/chi/v5"
)

// Wire${capitalizedName}Dependencies sets up dependency injection for ${data.name}
func Wire${capitalizedName}Dependencies() chi.Router {
${setupCode}
}
`;
}

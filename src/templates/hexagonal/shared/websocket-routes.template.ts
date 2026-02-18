import type { TemplateData } from '../../../types';

export function generateWebSocketRoutesTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName } = data;

  return `import { ${capitalizedName}WsHandler } from './${data.name}.ws-handler';
import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${data.name}.use-case.port';

export function create${capitalizedName}WsConfig(useCases: ${capitalizedName}UseCasePort) {
  const ${camelCaseName}WsHandler = new ${capitalizedName}WsHandler(useCases);

  return {
    path: '/ws/${pluralName}',
    open(ws: { send: (data: string) => void }) {
      ${camelCaseName}WsHandler.handleOpen(ws);
    },
    message(ws: { send: (data: string) => void }, message: string | Buffer) {
      ${camelCaseName}WsHandler.handleMessage(ws, message);
    },
    close(ws: unknown) {
      ${camelCaseName}WsHandler.handleClose(ws);
    },
  };
}
`;
}

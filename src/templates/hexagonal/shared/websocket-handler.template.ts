import type { TemplateData } from '../../../types';

export function generateWebSocketHandlerTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName } = data;

  return `import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${data.name}.use-case.port';

export interface WsMessage {
  action: 'getAll' | 'getById' | 'create' | 'update' | 'delete';
  id?: string;
  payload?: unknown;
}

export class ${capitalizedName}WsHandler {
  constructor(private readonly ${camelCaseName}UseCases: ${capitalizedName}UseCasePort) {}

  async handleOpen(ws: { send: (data: string) => void }): Promise<void> {
    ws.send(JSON.stringify({ type: 'connected', resource: '${data.name}' }));
  }

  async handleMessage(ws: { send: (data: string) => void }, raw: string | Buffer): Promise<void> {
    try {
      const message: WsMessage = JSON.parse(String(raw));

      switch (message.action) {
        case 'getAll': {
          const ${data.pluralName} = await this.${camelCaseName}UseCases.getAll${capitalizedName}s();
          ws.send(JSON.stringify({ type: '${data.pluralName}', data: ${data.pluralName} }));
          break;
        }
        case 'getById': {
          if (!message.id) {
            ws.send(JSON.stringify({ type: 'error', error: 'ID is required' }));
            return;
          }
          const ${camelCaseName} = await this.${camelCaseName}UseCases.get${capitalizedName}ById(message.id);
          ws.send(JSON.stringify({ type: '${data.name}', data: ${camelCaseName} }));
          break;
        }
        case 'create': {
          const created = await this.${camelCaseName}UseCases.create${capitalizedName}(message.payload as any);
          ws.send(JSON.stringify({ type: '${data.name}:created', data: created }));
          break;
        }
        case 'update': {
          if (!message.id) {
            ws.send(JSON.stringify({ type: 'error', error: 'ID is required' }));
            return;
          }
          const updated = await this.${camelCaseName}UseCases.update${capitalizedName}(message.id, message.payload as any);
          ws.send(JSON.stringify({ type: '${data.name}:updated', data: updated }));
          break;
        }
        case 'delete': {
          if (!message.id) {
            ws.send(JSON.stringify({ type: 'error', error: 'ID is required' }));
            return;
          }
          await this.${camelCaseName}UseCases.delete${capitalizedName}(message.id);
          ws.send(JSON.stringify({ type: '${data.name}:deleted', id: message.id }));
          break;
        }
        default:
          ws.send(JSON.stringify({ type: 'error', error: \`Unknown action: \${(message as WsMessage).action}\` }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      ws.send(JSON.stringify({ type: 'error', error: errorMessage }));
    }
  }

  async handleClose(_ws: unknown): Promise<void> {
    // Handle connection close if needed
  }
}
`;
}

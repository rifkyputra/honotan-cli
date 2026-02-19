import type { MonorepoTemplateData } from '../../../../types';

export function generateS3Index(_data: MonorepoTemplateData): string {
  return `import { AwsClient } from "aws4fetch";

export interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

class S3Client {
  private bucket: string;
  private endpoint: string;
  private awsClient: AwsClient;

  constructor({ endpoint, accessKeyId, secretAccessKey, bucket }: S3Config) {
    this.endpoint = endpoint;
    this.bucket = bucket;
    this.awsClient = new AwsClient({
      accessKeyId,
      secretAccessKey,
      region: "auto",
    });
  }

  private extractField(fieldName: string, contentBlock: string): string | undefined {
    const regex = new RegExp(\`<\${fieldName}>([^<]*)<\\/\${fieldName}>\`, "i");
    const fieldMatch = contentBlock.match(regex);
    return fieldMatch?.[1]?.trim();
  }

  private parseS3ListObjects(xmlText: string) {
    const objects = [];
    const contentsRegex = /<Contents>([\\s\\S]*?)<\\/Contents>/g;
    let match;

    while ((match = contentsRegex.exec(xmlText)) !== null) {
      const contentBlock = match[1];
      if (!contentBlock) continue;

      const key = this.extractField("Key", contentBlock);
      const lastModified = this.extractField("LastModified", contentBlock);
      const size = this.extractField("Size", contentBlock);
      const etag = this.extractField("ETag", contentBlock);

      if (key) {
        objects.push({
          Key: key,
          LastModified: lastModified ? new Date(lastModified) : undefined,
          Size: size ? parseInt(size, 10) : undefined,
          ETag: etag?.replace(/"/g, ""),
        });
      }
    }

    return { Contents: objects };
  }

  async listObjects() {
    const url = new URL(\`/\${this.bucket}\`, this.endpoint);
    const response = await this.awsClient.fetch(url.toString());

    if (!response.ok) {
      throw new Error(\`Failed to list objects: \${response.status} \${response.statusText}\`);
    }

    return this.parseS3ListObjects(await response.text());
  }

  async putObject(
    fileName: string,
    data: string | Uint8Array | Buffer | ReadableStream | File | Blob,
  ) {
    const key = \`uploads/\${Date.now()}-\${fileName}\`;
    const url = new URL(\`/\${this.bucket}/\${key}\`, this.endpoint);

    let contentLength: number;
    let bodyData: string | Uint8Array | Buffer | File | Blob;

    if (data instanceof Uint8Array || data instanceof Buffer) {
      contentLength = data.length;
      bodyData = data;
    } else if (data instanceof File || data instanceof Blob) {
      contentLength = data.size;
      bodyData = data;
    } else if (typeof data === "string") {
      contentLength = new TextEncoder().encode(data).length;
      bodyData = data;
    } else {
      const chunks: Uint8Array[] = [];
      const reader = data.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      const buffer = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }
      contentLength = buffer.length;
      bodyData = buffer;
    }

    const response = await this.awsClient.fetch(url.toString(), {
      method: "PUT",
      body: bodyData,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": contentLength.toString(),
      },
    });

    if (!response.ok) {
      throw new Error(\`Failed to upload object: \${response.status} \${response.statusText}\`);
    }

    return {
      ETag: response.headers.get("ETag"),
      url: url.toString(),
      Key: key,
    };
  }

  async getObject(key: string) {
    const url = new URL(\`/\${this.bucket}/\${key}\`, this.endpoint);
    const response = await this.awsClient.fetch(url.toString());

    if (!response.ok) {
      throw new Error(\`Failed to get object: \${response.status} \${response.statusText}\`);
    }

    return response;
  }

  async deleteObject(key: string) {
    const url = new URL(\`/\${this.bucket}/\${key}\`, this.endpoint);
    const response = await this.awsClient.fetch(url.toString(), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(\`Failed to delete object: \${response.status} \${response.statusText}\`);
    }

    return true;
  }
}

export function createS3Client(config: S3Config): S3Client {
  return new S3Client(config);
}

export type { S3Client };
`;
}

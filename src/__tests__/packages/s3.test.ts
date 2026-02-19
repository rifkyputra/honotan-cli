import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';

const withS3 = makeMonorepoData('test-with-s3', {
  infraPackages: ['s3'],
  hasS3: true,
});

describe('packages/s3 — files are generated', () => {
  let gen: Awaited<ReturnType<typeof scaffold>>;

  beforeAll(async () => {
    gen = await scaffold(withS3);
  });

  test('package.json is generated', () => {
    expect(gen.exists('packages/s3/package.json')).toBe(true);
  });

  test('tsconfig.json is generated', () => {
    expect(gen.exists('packages/s3/tsconfig.json')).toBe(true);
  });

  test('src/index.ts is generated', () => {
    expect(gen.exists('packages/s3/src/index.ts')).toBe(true);
  });
});

describe('packages/s3/package.json', () => {
  let pkg: Record<string, any>;

  beforeAll(async () => {
    const gen = await scaffold(withS3);
    pkg = JSON.parse(await gen.read('packages/s3/package.json'));
  });

  test('has correct package name with scope', () => {
    expect(pkg.name).toBe('@test-with-s3/s3');
  });

  test('depends on aws4fetch from catalog', () => {
    expect(pkg.dependencies?.['aws4fetch']).toBe('catalog:');
  });

  test('exports "." entry', () => {
    expect(pkg.exports?.['.']?.default ?? pkg.exports?.['.'])
      .toContain('./src/index.ts');
  });
});

describe('packages/s3/src/index.ts', () => {
  let content: string;

  beforeAll(async () => {
    const gen = await scaffold(withS3);
    content = await gen.read('packages/s3/src/index.ts');
  });

  test('imports AwsClient from aws4fetch', () => {
    expect(content).toContain('aws4fetch');
    expect(content).toContain('AwsClient');
  });

  test('exports createS3Client factory', () => {
    expect(content).toContain('createS3Client');
  });

  test('exports S3Config interface', () => {
    expect(content).toContain('S3Config');
  });

  test('implements listObjects', () => {
    expect(content).toContain('listObjects');
  });

  test('implements putObject', () => {
    expect(content).toContain('putObject');
  });

  test('implements getObject', () => {
    expect(content).toContain('getObject');
  });

  test('implements deleteObject', () => {
    expect(content).toContain('deleteObject');
  });

  test('uses configurable endpoint (not hardcoded)', () => {
    expect(content).toContain('this.endpoint');
    expect(content).not.toContain('r2.cloudflarestorage.com');
  });
});

describe('packages/env/src/server.ts — S3 vars', () => {
  let content: string;

  beforeAll(async () => {
    const gen = await scaffold(withS3);
    content = await gen.read('packages/env/src/server.ts');
  });

  test('includes S3_ENDPOINT', () => {
    expect(content).toContain('S3_ENDPOINT');
  });

  test('includes S3_ACCESS_KEY_ID', () => {
    expect(content).toContain('S3_ACCESS_KEY_ID');
  });

  test('includes S3_SECRET_ACCESS_KEY', () => {
    expect(content).toContain('S3_SECRET_ACCESS_KEY');
  });

  test('includes S3_BUCKET', () => {
    expect(content).toContain('S3_BUCKET');
  });
});

describe('root package.json — catalog', () => {
  let pkg: Record<string, any>;

  beforeAll(async () => {
    const gen = await scaffold(withS3);
    pkg = JSON.parse(await gen.read('package.json'));
  });

  test('includes aws4fetch in catalog', () => {
    expect(pkg.workspaces?.catalog?.['aws4fetch']).toBeDefined();
  });
});

describe('.env.example — S3 vars', () => {
  let content: string;

  beforeAll(async () => {
    const gen = await scaffold(withS3);
    content = await gen.read('.env.example');
  });

  test('includes S3_ENDPOINT example', () => {
    expect(content).toContain('S3_ENDPOINT');
  });

  test('includes S3_BUCKET example', () => {
    expect(content).toContain('S3_BUCKET');
  });
});

describe('packages/s3 — not generated without hasS3', () => {
  test('package dir does not exist in minimal build', async () => {
    const gen = await scaffold(makeMonorepoData('test-no-s3'));
    expect(gen.exists('packages/s3/package.json')).toBe(false);
  });
});

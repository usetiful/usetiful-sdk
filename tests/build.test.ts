import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

describe('Build Integration', () => {
  const distPath = path.join(__dirname, '..', 'dist');
  const indexJsPath = path.join(distPath, 'index.js');
  const indexDtsPath = path.join(distPath, 'index.d.ts');

  beforeAll(() => {
    // Clean and build
    try {
      execSync('npm run clean', { cwd: path.join(__dirname, '..') });
    } catch (e) {
      // Ignore error if dist doesn't exist
    }
    execSync('npm run build', { cwd: path.join(__dirname, '..') });
  });

  it('should create dist directory', () => {
    expect(existsSync(distPath)).toBe(true);
  });

  it('should create index.js file', () => {
    expect(existsSync(indexJsPath)).toBe(true);
  });

  it('should create index.d.ts file', () => {
    expect(existsSync(indexDtsPath)).toBe(true);
  });

  it('should contain all exported functions in built JS', () => {
    const jsContent = readFileSync(indexJsPath, 'utf-8');

    // Check that all functions are exported in the minified JS
    expect(jsContent).toContain('clearUsetifulProgress');
    expect(jsContent).toContain('loadUsetifulScript');
    expect(jsContent).toContain('reinitializeUsetiful');
    expect(jsContent).toContain('removeAllUsetifulTags');
    expect(jsContent).toContain('removeUsetifulTag');
    expect(jsContent).toContain('setUsetifulTag');
    expect(jsContent).toContain('setUsetifulTags');
  });

  it('should contain all function declarations in TypeScript definitions', () => {
    const dtsContent = readFileSync(indexDtsPath, 'utf-8');

    // Check TypeScript declarations
    expect(dtsContent).toContain('export declare function loadUsetifulScript');
    expect(dtsContent).toContain('export declare function setUsetifulTags');
    expect(dtsContent).toContain(
      'export declare function reinitializeUsetiful'
    );
    expect(dtsContent).toContain(
      'export declare function clearUsetifulProgress'
    );
    expect(dtsContent).toContain(
      'export declare function removeAllUsetifulTags'
    );
    expect(dtsContent).toContain('export declare function removeUsetifulTag');
    expect(dtsContent).toContain('export declare function setUsetifulTag');
  });

  it('should have proper interface definitions', () => {
    const dtsContent = readFileSync(indexDtsPath, 'utf-8');

    // Check interfaces
    expect(dtsContent).toContain('interface UserApi');
    expect(dtsContent).toContain('interface UsetifulApi');
    expect(dtsContent).toContain('interface UsetifulTags');
    expect(dtsContent).toContain('interface ScriptSettings');
  });

  it('should have non-empty build artifacts', () => {
    const jsContent = readFileSync(indexJsPath, 'utf-8');
    const dtsContent = readFileSync(indexDtsPath, 'utf-8');

    expect(jsContent.length).toBeGreaterThan(100);
    expect(dtsContent.length).toBeGreaterThan(100);
  });
});

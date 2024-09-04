import esbuild from 'esbuild';
import { execSync } from 'child_process';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalDevelopment = process.env.NODE_ENV === 'local';

execSync('tsc --emitDeclarationOnly');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm', // or 'cjs' if you prefer
    platform: 'neutral', // Ensures compatibility with both browser and Node environments
    define: {
      'process.env.USETIFUL_SCRIPT_URL': JSON.stringify(
        isProduction
          ? 'https://www.usetiful.com/dist/usetiful.js'
          : isDevelopment
          ? 'https://dev.usetiful.com/dist/usetiful.js'
          : isLocalDevelopment
          ? 'https://www.usetiful.dev/dist/usetiful.js'
          : 'https://www.usetiful.com/dist/usetiful.js' // Optional fallback if none match
      ),
    },
    minify: isProduction,
    sourcemap: isDevelopment || isLocalDevelopment,
  })
  .catch(() => process.exit(1));
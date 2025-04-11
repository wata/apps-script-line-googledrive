import esbuild from 'esbuild'
import { GasPlugin } from 'esbuild-gas-plugin'

esbuild
  .build({
    entryPoints: ['./src/Code.ts'],
    bundle: true,
    outfile: './dist/Code.js',
    plugins: [GasPlugin],
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

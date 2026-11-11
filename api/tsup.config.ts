import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/server.ts'],
  target: 'node22',
  format: ['cjs'],
  splitting: false,
  sourcemap: !!options.watch,
  keepNames: true,
  minify: !options.watch,
  clean: true,
  noExternal: [/(^@abacatepay\/)/],
  onSuccess: options.watch ? 'node --disable-warning=DEP0040 dist/server.js' : undefined
}))

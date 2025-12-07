import react from '@vitejs/plugin-react'

export default (async () => {
  const { defineConfig } = await import('vite');
  return defineConfig({
    base: '/secretsanta',
    plugins: [react()],
  })
})();

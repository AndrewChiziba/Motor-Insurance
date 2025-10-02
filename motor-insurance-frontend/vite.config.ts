import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: 'localhost',
//     port: 3001, // Alternative port
//     strictPort: true, // Don't try other ports if 3001 is taken
//   },
// })

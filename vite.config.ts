import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import postCssPxToRem from 'wa-postcss-pxtorem'
import tailwindCss from 'tailwindcss'
import viteCompression from 'vite-plugin-compression'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    mkcert(),
    viteCompression({
      threshold: 1024000 // 对大于 1mb 的文件进行压缩
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      styles: path.resolve(__dirname, 'src/styles'),
      pages: path.resolve(__dirname, 'src/pages'),
      components: path.resolve(__dirname, 'src/components'),
      mocks: path.resolve(__dirname, 'mocks')
      // 'store-operations-ui': path.resolve(__dirname, '../store-request/src')
    }
  },
  server: {
    https: true,
    proxy: {
      '/admin-api': {
        target: 'http://111.229.138.125:18080'
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 75,
          propList: ['*'],
          selectorBlackList: ['./to', 'html'], // to开头的不进行转换,
          exclude: '/node_modules',
          unit: 'wx'
        }),
        tailwindCss()
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/styles/main.scss";'
      }
    }
  }
})

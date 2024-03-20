// vite.config.ts
import vue from "file:///D:/code/store-operations-admin/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/code/store-operations-admin/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "file:///D:/code/store-operations-admin/node_modules/vite/dist/node/index.js";
import mkcert from "file:///D:/code/store-operations-admin/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import postCssPxToRem from "file:///D:/code/store-operations-admin/node_modules/wa-postcss-pxtorem/index.js";
import tailwindCss from "file:///D:/code/store-operations-admin/node_modules/tailwindcss/lib/index.js";
import viteCompression from "file:///D:/code/store-operations-admin/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/code/store-operations-admin/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    mkcert(),
    viteCompression({
      threshold: 1024e3
      // 对大于 1mb 的文件进行压缩
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      hooks: path.resolve(__dirname, "src/hooks"),
      styles: path.resolve(__dirname, "src/styles"),
      pages: path.resolve(__dirname, "src/pages"),
      components: path.resolve(__dirname, "src/components"),
      mocks: path.resolve(__dirname, "mocks")
      // 'store-operations-ui': path.resolve(__dirname, '../store-request/src')
    }
  },
  server: {
    https: false
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          rootValue: 75,
          propList: ["*"],
          selectorBlackList: ["./to", "html"],
          // to开头的不进行转换,
          exclude: "/node_modules",
          unit: "wx"
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
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RlXFxcXHN0b3JlLW9wZXJhdGlvbnMtYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNvZGVcXFxcc3RvcmUtb3BlcmF0aW9ucy1hZG1pblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29kZS9zdG9yZS1vcGVyYXRpb25zLWFkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXG5pbXBvcnQgcGF0aCwgeyBkaXJuYW1lIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IG1rY2VydCBmcm9tICd2aXRlLXBsdWdpbi1ta2NlcnQnXG5pbXBvcnQgcG9zdENzc1B4VG9SZW0gZnJvbSAnd2EtcG9zdGNzcy1weHRvcmVtJ1xuaW1wb3J0IHRhaWx3aW5kQ3NzIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbidcblxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKVxuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShfX2ZpbGVuYW1lKVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIHZ1ZUpzeCgpLFxuICAgIG1rY2VydCgpLFxuICAgIHZpdGVDb21wcmVzc2lvbih7XG4gICAgICB0aHJlc2hvbGQ6IDEwMjQwMDAgLy8gXHU1QkY5XHU1OTI3XHU0RThFIDFtYiBcdTc2ODRcdTY1ODdcdTRFRjZcdThGREJcdTg4NENcdTUzOEJcdTdGMjlcbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgaG9va3M6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaG9va3MnKSxcbiAgICAgIHN0eWxlczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9zdHlsZXMnKSxcbiAgICAgIHBhZ2VzOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3BhZ2VzJyksXG4gICAgICBjb21wb25lbnRzOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NvbXBvbmVudHMnKSxcbiAgICAgIG1vY2tzOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbW9ja3MnKVxuICAgICAgLy8gJ3N0b3JlLW9wZXJhdGlvbnMtdWknOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vc3RvcmUtcmVxdWVzdC9zcmMnKVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaHR0cHM6IGZhbHNlXG4gIH0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcG9zdENzc1B4VG9SZW0oe1xuICAgICAgICAgIHJvb3RWYWx1ZTogNzUsXG4gICAgICAgICAgcHJvcExpc3Q6IFsnKiddLFxuICAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbJy4vdG8nLCAnaHRtbCddLCAvLyB0b1x1NUYwMFx1NTkzNFx1NzY4NFx1NEUwRFx1OEZEQlx1ODg0Q1x1OEY2Q1x1NjM2MixcbiAgICAgICAgICBleGNsdWRlOiAnL25vZGVfbW9kdWxlcycsXG4gICAgICAgICAgdW5pdDogJ3d4J1xuICAgICAgICB9KSxcbiAgICAgICAgdGFpbHdpbmRDc3MoKVxuICAgICAgXVxuICAgIH0sXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgc2Nzczoge1xuICAgICAgICBhZGRpdGlvbmFsRGF0YTogJ0BpbXBvcnQgXCIuL3NyYy9zdHlsZXMvbWFpbi5zY3NzXCI7J1xuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1IsT0FBTyxTQUFTO0FBQ2xTLE9BQU8sWUFBWTtBQUNuQixPQUFPLFFBQVEsZUFBZTtBQUM5QixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxvQkFBb0I7QUFDM0IsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxxQkFBcUI7QUFSNkksSUFBTSwyQ0FBMkM7QUFVMU4sSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLFFBQVEsVUFBVTtBQUdwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxnQkFBZ0I7QUFBQSxNQUNkLFdBQVc7QUFBQTtBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsS0FBSztBQUFBLE1BQ2xDLE9BQU8sS0FBSyxRQUFRLFdBQVcsV0FBVztBQUFBLE1BQzFDLFFBQVEsS0FBSyxRQUFRLFdBQVcsWUFBWTtBQUFBLE1BQzVDLE9BQU8sS0FBSyxRQUFRLFdBQVcsV0FBVztBQUFBLE1BQzFDLFlBQVksS0FBSyxRQUFRLFdBQVcsZ0JBQWdCO0FBQUEsTUFDcEQsT0FBTyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUE7QUFBQSxJQUV4QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxlQUFlO0FBQUEsVUFDYixXQUFXO0FBQUEsVUFDWCxVQUFVLENBQUMsR0FBRztBQUFBLFVBQ2QsbUJBQW1CLENBQUMsUUFBUSxNQUFNO0FBQUE7QUFBQSxVQUNsQyxTQUFTO0FBQUEsVUFDVCxNQUFNO0FBQUEsUUFDUixDQUFDO0FBQUEsUUFDRCxZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxJQUNBLHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

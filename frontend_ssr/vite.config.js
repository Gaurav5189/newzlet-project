import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      tailwindcss(),
      reactRouter(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    ...(env.VITE_DEV_PROXY_TARGET && {
      server: {
        proxy: {
          '/api': {
            target: env.VITE_DEV_PROXY_TARGET,
            changeOrigin: true,
          }
        }
      }
    })
  };
});

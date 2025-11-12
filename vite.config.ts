import { defineConfig, ViteDevServer, Connect } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import { IncomingMessage, ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    {
      name: 'serve-storybook-static',
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
          if (req.url?.startsWith('/storybook-static/')) {
            const filePath = path.join(process.cwd(), 'storybook-static', req.url.replace('/storybook-static/', ''));
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath);
              const ext = path.extname(filePath);
              const mimeTypes: Record<string, string> = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.svg': 'image/svg+xml',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.woff2': 'font/woff2',
                '.txt': 'text/plain',
              };
              res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
              res.end(content);
              return;
            }
          }
          next();
        });
      }
    }
  ].filter(Boolean),
  preview: {
    allowedHosts: ['designsystem.demostoke.com'],
    port: 4173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

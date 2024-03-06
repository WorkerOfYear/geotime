import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
 base: "/",
 plugins: [svgr(), react()],
 preview: {
  port: 3000,
  strictPort: true,
 },
 server: {
  port: 3000,
  strictPort: true,
  host: true,
  origin: "http://0.0.0.0:3000",
 },
});
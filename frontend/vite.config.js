import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "192.168.1.5", // or your specific local IP
    port: 3001, // or any port you're using
  },
});

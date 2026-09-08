import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      redux: path.posix.resolve("src/redux"),
      "react-redux": path.posix.resolve("src/react-redux"),
    },
  },
  plugins: [react()],
});

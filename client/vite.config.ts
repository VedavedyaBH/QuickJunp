import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        define: {
            "process.env.REACT_APP_SERVER_BASE_URL": JSON.stringify(
                env.REACT_APP_SERVER_BASE_URL
            ),
        },
        plugins: [react()],
    };
});

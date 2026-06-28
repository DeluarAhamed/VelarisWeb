import React from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2a797c",
          colorTextBase: "#070e1a",
          colorBgBase: "#ffffff",
          colorBgLayout: "#f5f8f8",
          borderRadius: 8,
          borderRadiusLG: 8,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 44,
            paddingInline: 22,
          },
          Card: {
            borderRadiusLG: 8,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);

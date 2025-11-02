import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from '@chakra-ui/react';
import theme from "./styles/theme";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./App";
import AuthProvider  from "./pages/AuthContext";
import "./App.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

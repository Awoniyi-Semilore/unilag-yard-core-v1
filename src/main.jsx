import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from '@chakra-ui/react';
import theme from "./styles/theme";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./App";
import { AuthProvider } from "./Hooks/useAuth.jsx"; // Import from hooks folder
import ErrorBoundary from "./component/ErrorBoundary";
import "./App.css"; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider> {/* This should match your actual AuthProvider export */}
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
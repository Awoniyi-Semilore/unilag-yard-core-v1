import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from '@chakra-ui/react';
import theme from "./styles/theme";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./App";
import { AuthProvider } from "./Hooks/useAuth.jsx";
import { ThemeProvider } from "./context/Theme context.jsx"; // Import ThemeProvider
import ErrorBoundary from "./component/ErrorBoundary";
import "./App.css"; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <ThemeProvider> {/* Add ThemeProvider here */}
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
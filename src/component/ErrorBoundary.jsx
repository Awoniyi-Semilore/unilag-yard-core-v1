import React from 'react';
import { Box, Text, Button, VStack, Alert, AlertIcon } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error Boundary Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} textAlign="center">
          <Alert status="error" mb={4}>
            <AlertIcon />
            Something went wrong with this component
          </Alert>
          <VStack spacing={4}>
            <Text color="red.500" fontSize="lg">
              {this.state.error && this.state.error.toString()}
            </Text>
            <Button 
              colorScheme="blue" 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
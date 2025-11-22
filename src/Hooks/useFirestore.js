import { useState, useEffect } from 'react';
import { getProducts, getSavedProducts } from '../firebase/firestore';

export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getProducts(options);
        
        if (result.success) {
          setProducts(result.products);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(options)]);

  const refetch = async () => {
    const result = await getProducts(options);
    if (result.success) setProducts(result.products);
  };

  return { products, loading, error, refetch };
};

export const useSavedProducts = (userId) => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedProducts = async () => {
      if (!userId) {
        setSavedProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getSavedProducts(userId);
        
        if (result.success) {
          setSavedProducts(result.products);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load saved products.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProducts();
  }, [userId]);

  return { savedProducts, loading, error };
};
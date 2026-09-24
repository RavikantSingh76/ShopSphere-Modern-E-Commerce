import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem('compare_items');
    return saved ? JSON.parse(saved) : [];
  });
  const { info, warning } = useToast();

  useEffect(() => {
    localStorage.setItem('compare_items', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    if (compareItems.some((item) => item.id === product.id)) {
      warning('Product is already in the comparison list');
      return;
    }
    if (compareItems.length >= 4) {
      warning('You can compare a maximum of 4 products at a time');
      return;
    }
    setCompareItems((prev) => [...prev, product]);
    info(`Added "${product.name}" to compare list`);
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.some((item) => item.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

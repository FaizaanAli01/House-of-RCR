import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'house_of_rcr_cart_v2';
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;
const TAX_RATE = 0.05; // 5% GST

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) {
      addToast(`Sorry, "${product.name}" is currently out of stock.`, 'error');
      return;
    }

    const productId = product._id || product.id || product.slug;
    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default');
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size');
    const itemKey = `${productId}-${color}-${size}`;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey);
      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const availableStock = prevItems[existingIndex].stock || stock;

        if (currentQty >= availableStock) {
          addToast(`Maximum available stock (${availableStock} units) already in your cart.`, 'info');
          return prevItems;
        }

        const updated = [...prevItems];
        const newQty = Math.min(currentQty + quantity, availableStock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          stock: availableStock,
        };
        addToast(`Updated quantity for "${product.name}" in your cart!`, 'success');
        return updated;
      } else {
        const initialQty = Math.min(quantity, stock);
        addToast(`"${product.name}" added to your cart!`, 'success');
        return [
          ...prevItems,
          {
            key: itemKey,
            id: productId,
            name: product.name,
            brand: product.brand || 'House of RCR',
            price: Number(product.price),
            originalPrice: Number(product.originalPrice) || Number(product.price),
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            color,
            size,
            stock,
            quantity: initialQty,
          },
        ];
      }
    });
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === itemKey) {
          const clampedQty = Math.min(newQuantity, item.stock);
          if (newQuantity > item.stock) {
            addToast(`Only ${item.stock} items available in stock.`, 'info');
          }
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.key === itemKey);
      if (itemToRemove) {
        addToast(`Removed "${itemToRemove.name}" from your cart.`, 'info');
      }
      return prevItems.filter((item) => item.key !== itemKey);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const applyPromo = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'RCR10') {
      setAppliedPromo({ code: 'RCR10', discountPercent: 10, label: '10% Extra Discount' });
      addToast('Coupon Applied! You got 10% discount.', 'success');
      return { success: true };
    } else if (cleanCode === 'FIRST15') {
      setAppliedPromo({ code: 'FIRST15', discountPercent: 15, label: 'First Order Discount (15% Off)' });
      addToast('Coupon Applied! You got 15% discount.', 'success');
      return { success: true };
    } else {
      addToast('Invalid coupon code. Try "RCR10" or "FIRST15"', 'error');
      return { success: false, message: 'Invalid coupon. Try "RCR10" or "FIRST15"' };
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    addToast('Coupon code removed.', 'info');
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;

  const eligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = cartItems.length === 0 ? 0 : eligibleForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * TAX_RATE);
  const grandTotal = Math.max(0, taxableAmount + shippingFee + taxAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        discountAmount,
        appliedPromo,
        shippingFee,
        taxAmount,
        grandTotal,
        FREE_SHIPPING_THRESHOLD,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

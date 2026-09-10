import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/cartApi';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'house_of_rcr_cart_v2';
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;
const TAX_RATE = 0.05;

// Transform a DB cart item into the frontend cart item shape
const toFrontendItem = (dbItem) => ({
  key: dbItem._id.toString(),
  dbId: dbItem._id.toString(),
  id: dbItem.product,
  name: dbItem.name,
  brand: 'House of RCR',
  price: dbItem.price,
  originalPrice: dbItem.price,
  image: dbItem.image || '',
  color: dbItem.color,
  size: dbItem.size,
  stock: 99999, // stock enforced by backend
  quantity: dbItem.quantity,
});

const calcTotals = (items, appliedPromo) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;
  const shippingFee =
    items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxable * TAX_RATE);
  const grandTotal = Math.max(0, taxable + shippingFee + taxAmount);
  return { subtotal, discountAmount, shippingFee, taxAmount, grandTotal };
};

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();
  const { user, token, isAuthenticated, authLoading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  const initializedRef = useRef(false);
  const prevUserIdRef = useRef(null);

  // Helpers
  const getLocalCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };
  const saveLocalCart = (items) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {}
  };

  const loadDbCart = useCallback(async () => {
    if (!token) return;
    setCartLoading(true);
    try {
      const data = await cartApi.getCart(token);
      if (data.success) setCartItems(data.cart.items.map(toFrontendItem));
    } catch (e) {
      console.error('Cart load error:', e.message);
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  // Handle auth state changes (login / logout / initial load)
  useEffect(() => {
    if (authLoading) return;

    const currentUserId = user?._id || null;

    if (!initializedRef.current) {
      // First run after auth resolves
      initializedRef.current = true;
      prevUserIdRef.current = currentUserId;

      if (currentUserId) {
        loadDbCart();
      } else {
        setCartItems(getLocalCart());
      }
      return;
    }

    const prevUserId = prevUserIdRef.current;
    prevUserIdRef.current = currentUserId;

    if (currentUserId && !prevUserId) {
      // Just logged in — sync localStorage cart into DB
      const localItems = getLocalCart();
      const doSync = async () => {
        setCartLoading(true);
        try {
          if (localItems.length > 0) {
            const payload = localItems.map((i) => ({
              productId: i.id,
              quantity: i.quantity,
              color: i.color,
              size: i.size,
            }));
            const data = await cartApi.syncCart(token, payload);
            if (data.success) setCartItems(data.cart.items.map(toFrontendItem));
            localStorage.removeItem(CART_STORAGE_KEY);
          } else {
            await loadDbCart();
          }
        } catch {
          await loadDbCart();
        } finally {
          setCartLoading(false);
        }
      };
      doSync();
    } else if (!currentUserId && prevUserId) {
      // Just logged out
      setCartItems([]);
      setAppliedPromo(null);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [authLoading, user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync to localStorage for guests
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      saveLocalCart(cartItems);
    }
  }, [cartItems, isAuthenticated, authLoading]);

  // --- Cart operations ---

  const addToCart = async (
    product,
    quantity = 1,
    selectedColor = null,
    selectedSize = null
  ) => {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) {
      addToast(`Sorry, "${product.name}" is out of stock.`, 'error');
      return;
    }

    const productId = product._id || product.id || product.slug;
    const color =
      selectedColor ||
      (product.colors?.length > 0 ? product.colors[0].name : 'Default');
    const size =
      selectedSize ||
      (product.sizes?.length > 0 ? product.sizes[0] : 'Free Size');

    if (isAuthenticated && token) {
      setCartLoading(true);
      try {
        const data = await cartApi.addToCart(
          token,
          productId,
          quantity,
          color,
          size
        );
        if (data.success) {
          setCartItems(data.cart.items.map(toFrontendItem));
          addToast(`"${product.name}" added to cart!`, 'success');
        }
      } catch (err) {
        addToast(err.message || 'Failed to add item to cart.', 'error');
      } finally {
        setCartLoading(false);
      }
    } else {
      // Guest: localStorage
      const itemKey = `${productId}-${color}-${size}`;
      setCartItems((prev) => {
        const idx = prev.findIndex((i) => i.key === itemKey);
        if (idx > -1) {
          const avail = prev[idx].stock || stock;
          if (prev[idx].quantity >= avail) {
            addToast(`Maximum stock (${avail}) already in cart.`, 'info');
            return prev;
          }
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: Math.min(updated[idx].quantity + quantity, avail),
          };
          addToast(`Updated quantity for "${product.name}".`, 'success');
          return updated;
        }
        addToast(`"${product.name}" added to cart!`, 'success');
        return [
          ...prev,
          {
            key: itemKey,
            id: productId,
            name: product.name,
            brand: product.brand || 'House of RCR',
            price: Number(product.price),
            originalPrice:
              Number(product.originalPrice) || Number(product.price),
            image: product.images?.length > 0 ? product.images[0] : '',
            color,
            size,
            stock,
            quantity: Math.min(quantity, stock),
          },
        ];
      });
    }
  };

  const updateQuantity = async (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    if (isAuthenticated && token) {
      const item = cartItems.find((i) => i.key === itemKey);
      if (!item?.dbId) return;
      setCartLoading(true);
      try {
        const data = await cartApi.updateCartItem(
          token,
          item.dbId,
          newQuantity
        );
        if (data.success) setCartItems(data.cart.items.map(toFrontendItem));
      } catch (err) {
        addToast(err.message || 'Failed to update cart.', 'error');
      } finally {
        setCartLoading(false);
      }
    } else {
      setCartItems((prev) =>
        prev.map((i) => {
          if (i.key === itemKey) {
            const clamped = Math.min(newQuantity, i.stock);
            if (newQuantity > i.stock)
              addToast(`Only ${i.stock} units available.`, 'info');
            return { ...i, quantity: clamped };
          }
          return i;
        })
      );
    }
  };

  const removeFromCart = async (itemKey) => {
    if (isAuthenticated && token) {
      const item = cartItems.find((i) => i.key === itemKey);
      if (!item?.dbId) return;
      setCartLoading(true);
      try {
        const data = await cartApi.removeFromCart(token, item.dbId);
        if (data.success) {
          setCartItems(data.cart.items.map(toFrontendItem));
          addToast('Item removed from cart.', 'info');
        }
      } catch (err) {
        addToast(err.message || 'Failed to remove item.', 'error');
      } finally {
        setCartLoading(false);
      }
    } else {
      setCartItems((prev) => {
        const item = prev.find((i) => i.key === itemKey);
        if (item) addToast(`Removed "${item.name}" from cart.`, 'info');
        return prev.filter((i) => i.key !== itemKey);
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && token) {
      setCartLoading(true);
      try {
        await cartApi.clearCart(token);
        setCartItems([]);
        setAppliedPromo(null);
      } catch (err) {
        addToast(err.message || 'Failed to clear cart.', 'error');
      } finally {
        setCartLoading(false);
      }
    } else {
      setCartItems([]);
      setAppliedPromo(null);
    }
  };

  const applyPromo = (code) => {
    const c = code.trim().toUpperCase();
    if (c === 'RCR10') {
      setAppliedPromo({ code: 'RCR10', discountPercent: 10, label: '10% Extra Discount' });
      addToast('Coupon applied! 10% off.', 'success');
      return { success: true };
    }
    if (c === 'FIRST15') {
      setAppliedPromo({ code: 'FIRST15', discountPercent: 15, label: 'First Order 15% Off' });
      addToast('Coupon applied! 15% off.', 'success');
      return { success: true };
    }
    addToast('Invalid coupon. Try "RCR10" or "FIRST15".', 'error');
    return { success: false, message: 'Invalid coupon. Try "RCR10" or "FIRST15".' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    addToast('Coupon removed.', 'info');
  };

  const totalItemsCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const { subtotal, discountAmount, shippingFee, taxAmount, grandTotal } =
    calcTotals(cartItems, appliedPromo);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
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
        loadDbCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

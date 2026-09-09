import { products as localFallbackProducts } from '../data/products';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to execute API requests with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.warn(`[API] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
};

/**
 * Fetch all products with query parameters (search, category, price, rating, sort, page)
 */
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });

  const queryString = query.toString() ? `?${query.toString()}` : '';

  try {
    const data = await apiRequest(`/products${queryString}`);
    return {
      products: data.products || [],
      totalProducts: data.totalProducts || 0,
      filteredProductsCount: data.filteredProductsCount || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
      fromAPI: true,
    };
  } catch {
    // Offline fallback for seamless dev experience if server not yet started
    console.info('[API] Using local fallback product dataset.');
    let filtered = [...localFallbackProducts];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter((p) => p.categorySlug === params.category);
    }
    if (params.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(params.maxPrice));
    }
    if (params.minRating) {
      filtered = filtered.filter((p) => p.rating >= Number(params.minRating));
    }
    if (params.deals === 'true' || params.filter === 'deals') {
      filtered = filtered.filter((p) => p.isDeal);
    }
    if (params.newArrivals === 'true' || params.filter === 'new') {
      filtered = filtered.filter((p) => p.isNewArrival);
    }

    return {
      products: filtered,
      totalProducts: localFallbackProducts.length,
      filteredProductsCount: filtered.length,
      page: 1,
      totalPages: 1,
      fromAPI: false,
    };
  }
};

/**
 * Fetch single product by ID or Slug
 */
export const fetchProductById = async (id) => {
  try {
    const data = await apiRequest(`/products/${id}`);
    return {
      product: data.product,
      stockStatus: data.stockStatus,
      fromAPI: true,
    };
  } catch {
    console.info(`[API] Falling back to local data for product ID: ${id}`);
    const found = localFallbackProducts.find(
      (p) => p.id === id || p.slug === id || p.id === `rcr-${id}`
    );
    if (!found) {
      throw new Error(`Product not found with identifier: ${id}`);
    }
    return {
      product: found,
      stockStatus: {
        inStock: (found.stock || 0) > 0,
        isLowStock: (found.stock || 0) > 0 && (found.stock || 0) <= 3,
        availableStock: found.stock || 0,
      },
      fromAPI: false,
    };
  }
};

/**
 * Fetch featured products for homepage
 */
export const fetchFeaturedProducts = async (limit = 8) => {
  try {
    const data = await apiRequest(`/products/featured?limit=${limit}`);
    return data.products || [];
  } catch {
    return localFallbackProducts.filter((p) => p.isFeatured).slice(0, limit);
  }
};

/**
 * Fetch deal products
 */
export const fetchDealProducts = async (limit = 8) => {
  try {
    const data = await apiRequest(`/products/deals?limit=${limit}`);
    return data.products || [];
  } catch {
    return localFallbackProducts.filter((p) => p.isDeal).slice(0, limit);
  }
};

/**
 * Fetch new arrival products
 */
export const fetchNewArrivals = async (limit = 8) => {
  try {
    const data = await apiRequest(`/products/new-arrivals?limit=${limit}`);
    return data.products || [];
  } catch {
    return localFallbackProducts.filter((p) => p.isNewArrival).slice(0, limit);
  }
};

/**
 * Check stock availability for order / cart item
 */
export const checkStockAvailability = async (productId, quantity = 1) => {
  try {
    const data = await apiRequest('/products/check-stock', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    return data;
  } catch {
    return {
      success: true,
      availableStock: 10,
      isAvailable: true,
      isOutOfStock: false,
      message: 'Stock check offline fallback',
    };
  }
};

/**
 * Backend API Health check
 */
export const checkBackendHealth = async () => {
  try {
    const data = await apiRequest('/health');
    return data;
  } catch {
    return { success: false, status: 'Offline' };
  }
};

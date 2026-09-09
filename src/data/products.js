export const products = [
  {
    id: 'rcr-001',
    name: 'Heavyweight Cotton Oversized T-Shirt',
    brand: 'House of RCR',
    category: 'T-Shirts & Polos',
    categorySlug: 't-shirts',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.8,
    reviewCount: 318,
    stock: 25,
    badge: 'Best Seller',
    isFeatured: true,
    isDeal: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Made from 100% premium 240 GSM heavy cotton. Designed in a comfortable loose oversized fit with a thick ribbed crew neck that does not loose shape after washes.',
    highlights: [
      '100% Pure Combed Cotton (240 GSM)',
      'Trendy relaxed oversized fit with drop shoulders',
      'Thick 1-inch rib neck collar',
      'Pre-shrunk fabric to prevent shrinkage after washing'
    ],
    specifications: {
      'Fabric': '100% Combed Cotton',
      'Fit': 'Oversized Fit',
      'Neck': 'Round Crew Neck',
      'Sleeve': 'Half Sleeve / Drop Shoulder',
      'Pattern': 'Solid Plain',
      'Wash Care': 'Machine wash cold, dry in shade'
    },
    colors: [
      { name: 'Onyx Black', hex: '#111827' },
      { name: 'Chalk White', hex: '#FFFFFF' },
      { name: 'Olive Green', hex: '#3F4E3E' },
      { name: 'Beige Sand', hex: '#D6C7B2' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'rcr-002',
    name: 'Pure Cotton Casual Check Shirt',
    brand: 'House of RCR',
    category: 'Shirts',
    categorySlug: 'shirts',
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    rating: 4.7,
    reviewCount: 184,
    stock: 18,
    badge: 'Popular',
    isFeatured: true,
    isDeal: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Soft brushed cotton casual shirt with clean modern checks. Comfortable for daily office wear, casual outings, or weekend parties.',
    highlights: [
      '100% Breathable Brushed Cotton fabric',
      'Regular smart fit suitable for all body types',
      'Spread collar with chest pocket',
      'Durable resin buttons and curved hem'
    ],
    specifications: {
      'Fabric': '100% Cotton',
      'Fit': 'Regular Fit',
      'Collar': 'Spread Collar',
      'Sleeve': 'Full Sleeve with button cuffs',
      'Pattern': 'Box Checks',
      'Wash Care': 'Machine wash with similar colors'
    },
    colors: [
      { name: 'Navy Blue & White', hex: '#1E3A8A' },
      { name: 'Maroon & Black', hex: '#881337' },
      { name: 'Forest Green', hex: '#14532D' }
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)']
  },
  {
    id: 'rcr-003',
    name: 'Fleece Heavyweight Pullover Hoodie',
    brand: 'House of RCR',
    category: 'Hoodies & Sweatshirts',
    categorySlug: 'hoodies-sweats',
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    rating: 4.9,
    reviewCount: 220,
    stock: 14,
    badge: 'Best Seller',
    isFeatured: true,
    isDeal: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Keep warm in style with this 380 GSM warm cotton fleece hoodie. Features a double-layered hood, spacious front kangaroo pocket, and ribbed cuffs.',
    highlights: [
      '380 GSM warm cotton-poly fleece inside',
      'Spacious front kangaroo pocket',
      'Double-layered hood with thick drawstrings',
      'Ribbed cuffs and waistband for a snug fit'
    ],
    specifications: {
      'Fabric': '80% Cotton, 20% Polyester Fleece',
      'Fit': 'Relaxed Fit',
      'Neck': 'Hooded with drawstrings',
      'Sleeve': 'Full Sleeve',
      'Pocket': 'Front Kangaroo Pocket',
      'Wash Care': 'Machine wash cold, do not bleach'
    },
    colors: [
      { name: 'Charcoal Grey', hex: '#334155' },
      { name: 'Jet Black', hex: '#0F172A' },
      { name: 'Oatmeal Beige', hex: '#E5E5E5' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'rcr-004',
    name: 'Slim Fit Stretch Denim Jeans',
    brand: 'House of RCR',
    category: 'Jeans & Trousers',
    categorySlug: 'jeans-trousers',
    price: 1699,
    originalPrice: 2299,
    discount: 26,
    rating: 4.8,
    reviewCount: 175,
    stock: 20,
    badge: 'Popular',
    isFeatured: true,
    isDeal: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Durable and comfortable stretch denim jeans designed for everyday wear. Offers a modern slim tapered fit with slight stretch for all-day ease.',
    highlights: [
      '98% Cotton with 2% Elastane for comfort stretch',
      'Classic 5-pocket jeans styling',
      'YKK zip fly with sturdy metal button closure',
      'Clean dark wash that goes with t-shirts and shirts'
    ],
    specifications: {
      'Fabric': '98% Cotton, 2% Elastane Denim',
      'Fit': 'Slim Fit',
      'Rise': 'Mid Rise',
      'Length': 'Full Length',
      'Closure': 'Zip Fly with Button',
      'Wash Care': 'Machine wash inside out'
    },
    colors: [
      { name: 'Dark Indigo Blue', hex: '#1E3A8A' },
      { name: 'Washed Black', hex: '#18181B' },
      { name: 'Light Blue', hex: '#60A5FA' }
    ],
    sizes: ['30', '32', '34', '36', '38']
  },
  {
    id: 'rcr-005',
    name: 'Festive Silk Blend Kurta Pajama Set',
    brand: 'House of RCR Ethnic',
    category: 'Ethnic & Festive Wear',
    categorySlug: 'ethnic-wear',
    price: 2499,
    originalPrice: 3499,
    discount: 28,
    rating: 4.9,
    reviewCount: 140,
    stock: 12,
    badge: 'Festive Special',
    isFeatured: true,
    isDeal: true,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Perfect for weddings, Diwali, and family celebrations. Made from rich art silk fabric with subtle jacquard self-design, paired with a comfortable white cotton-silk pajama.',
    highlights: [
      'Rich Art Silk fabric with elegant shine',
      'Mandarin collar with matching buttons and side pockets',
      'Complete 2-piece set (Kurta + Pajama)',
      'Comfortable straight fit knee-length kurta'
    ],
    specifications: {
      'Kurta Fabric': 'Art Silk Jacquard',
      'Pajama Fabric': 'Cotton Silk Blend',
      'Neck': 'Mandarin Collar',
      'Length': 'Knee Length',
      'Set Contains': '1 Kurta & 1 Pajama',
      'Wash Care': 'Dry clean recommended'
    },
    colors: [
      { name: 'Royal Navy Blue', hex: '#0F172A' },
      { name: 'Mustard Gold', hex: '#D97706' },
      { name: 'Maroon Wine', hex: '#881337' }
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)']
  },
  {
    id: 'rcr-006',
    name: 'Suede Finish Bomber Jacket',
    brand: 'House of RCR',
    category: 'Jackets & Coats',
    categorySlug: 'jackets-outerwear',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    rating: 4.8,
    reviewCount: 92,
    stock: 9,
    badge: 'Trending',
    isFeatured: true,
    isDeal: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A stylish premium suede-finish jacket with smooth front zipper, ribbed collar, and soft satin lining. Elevates any basic t-shirt and jeans combination.',
    highlights: [
      'Soft faux-suede fabric with smooth touch',
      'Full front metal zipper closure',
      'Two side pockets and one inside pocket',
      'Ribbed collar, cuffs, and bottom hem'
    ],
    specifications: {
      'Fabric': 'Premium Faux Suede Polyester',
      'Lining': '100% Polyester Satin',
      'Fit': 'Regular Bomber Fit',
      'Collar': 'Ribbed Baseball Collar',
      'Pockets': '3 Pockets',
      'Wash Care': 'Dry clean only'
    },
    colors: [
      { name: 'Tan Brown', hex: '#854D0E' },
      { name: 'Black', hex: '#18181B' },
      { name: 'Olive Green', hex: '#365314' }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'rcr-007',
    name: 'Satin Slip Party Dress',
    brand: 'House of RCR',
    category: 'Dresses & Western Wear',
    categorySlug: 'dresses',
    price: 1899,
    originalPrice: 2599,
    discount: 27,
    rating: 4.7,
    reviewCount: 110,
    stock: 15,
    badge: 'Popular',
    isFeatured: true,
    isDeal: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A smooth satin slip maxi dress featuring an elegant cowl neckline and adjustable shoulder straps. Perfect for dinner dates, evening events, and parties.',
    highlights: [
      'Silky smooth satin fabric with gentle sheen',
      'Flattering cowl neckline',
      'Adjustable thin shoulder straps',
      'Side slit for easy movement'
    ],
    specifications: {
      'Fabric': '100% Polyester Satin',
      'Fit': 'Body-Skimming Fit',
      'Length': 'Maxi Length',
      'Neckline': 'Cowl Neck',
      'Wash Care': 'Hand wash in cold water'
    },
    colors: [
      { name: 'Champagne Beige', hex: '#F5E6D3' },
      { name: 'Emerald Green', hex: '#064E3B' },
      { name: 'Ruby Red', hex: '#881337' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'rcr-008',
    name: 'Pure Cotton Tailored Formal Trousers',
    brand: 'House of RCR',
    category: 'Jeans & Trousers',
    categorySlug: 'jeans-trousers',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    rating: 4.8,
    reviewCount: 130,
    stock: 22,
    badge: 'Best Seller',
    isFeatured: false,
    isDeal: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Crisp, wrinkle-resistant cotton formal trousers tailored with pleats. Ideal for daily office, meetings, and smart-casual wear.',
    highlights: [
      '100% Wrinkle-resistant cotton blend',
      'Smart tapered leg with formal front pleats',
      'Side slash pockets and buttoned rear pockets',
      'Extended waistband tab for a clean look'
    ],
    specifications: {
      'Fabric': 'Poly-Cotton Blend',
      'Fit': 'Slim Tapered Fit',
      'Rise': 'Mid Rise',
      'Pattern': 'Solid Plain',
      'Wash Care': 'Machine wash warm, iron while damp'
    },
    colors: [
      { name: 'Charcoal Grey', hex: '#334155' },
      { name: 'Khaki Beige', hex: '#D4C3A3' },
      { name: 'Midnight Navy', hex: '#0F172A' }
    ],
    sizes: ['30', '32', '34', '36', '38']
  },
  {
    id: 'rcr-009',
    name: '100% Linen Solid Resort Shirt',
    brand: 'House of RCR',
    category: 'Shirts',
    categorySlug: 'shirts',
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    rating: 4.8,
    reviewCount: 95,
    stock: 16,
    badge: 'Trending',
    isFeatured: true,
    isDeal: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Super breathable 100% pure linen shirt with a relaxed resort Cuban collar. Keeps you cool and comfortable all day in Indian weather.',
    highlights: [
      '100% Pure Natural Linen fabric',
      'Trendy relaxed Cuban camp collar',
      'Naturally breathable and sweat-absorbent',
      'Lightweight and perfect for summer holidays'
    ],
    specifications: {
      'Fabric': '100% Pure Linen',
      'Fit': 'Relaxed Fit',
      'Collar': 'Cuban / Resort Collar',
      'Sleeve': 'Half Sleeve',
      'Wash Care': 'Gentle machine wash or hand wash'
    },
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#93C5FD' },
      { name: 'Olive Green', hex: '#4B553D' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'rcr-010',
    name: 'Genuine Leather Formal & Casual Belt',
    brand: 'House of RCR',
    category: 'Belts & Accessories',
    categorySlug: 'accessories',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.7,
    reviewCount: 260,
    stock: 35,
    badge: 'Best Seller',
    isFeatured: false,
    isDeal: true,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Made from 100% genuine top-grain leather with a sturdy brushed metal buckle. Suitable for formal trousers, chinos, and jeans.',
    highlights: [
      '100% Genuine Full-Grain Leather',
      'Heavy-duty alloy metal buckle with rust resistance',
      '35mm standard width fitting all pant loops',
      'Includes adjustment tool for custom sizing'
    ],
    specifications: {
      'Material': '100% Genuine Leather',
      'Width': '35 mm',
      'Buckle Type': 'Pin Buckle',
      'Care': 'Wipe clean with dry cloth'
    },
    colors: [
      { name: 'Tan Brown', hex: '#854D0E' },
      { name: 'Black', hex: '#0F172A' }
    ],
    sizes: ['28-32 Inch', '34-38 Inch', '40-44 Inch']
  },
  {
    id: 'rcr-011',
    name: 'Cotton Polo Collar T-Shirt',
    brand: 'House of RCR',
    category: 'T-Shirts & Polos',
    categorySlug: 't-shirts',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.8,
    reviewCount: 190,
    stock: 24,
    badge: 'Popular',
    isFeatured: false,
    isDeal: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Classic matty cotton polo t-shirt with ribbed collar and button placket. Great for Fridays at office, casual hangouts, and sports.',
    highlights: [
      '100% Matty Pique Cotton (220 GSM)',
      'Structured ribbed collar and sleeve cuffs',
      '2-button placket with branded buttons',
      'Side slits for comfort when sitting'
    ],
    specifications: {
      'Fabric': '100% Pique Cotton',
      'Fit': 'Regular Smart Fit',
      'Neck': 'Polo Collar',
      'Sleeve': 'Half Sleeve',
      'Wash Care': 'Machine wash cold'
    },
    colors: [
      { name: 'Navy Blue', hex: '#1E3A8A' },
      { name: 'Burgundy Red', hex: '#881337' },
      { name: 'Bottle Green', hex: '#14532D' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'rcr-012',
    name: 'Men’s Tailored Single-Breasted Blazer',
    brand: 'House of RCR',
    category: 'Jackets & Coats',
    categorySlug: 'jackets-outerwear',
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    rating: 4.9,
    reviewCount: 88,
    stock: 8,
    badge: 'Premium',
    isFeatured: true,
    isDeal: false,
    isNewArrival: false,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A sharp, structured 2-button blazer tailored with notch lapels, flap pockets, and double back vents. Pairs easily with formal trousers or dark jeans.',
    highlights: [
      'Poly-viscose wool touch fabric that resists creasing',
      '2-button single breasted front',
      'Notch lapel with chest pocket for pocket square',
      'Full inner lining with two internal wallet pockets'
    ],
    specifications: {
      'Fabric': 'Poly-Viscose Suiting Fabric',
      'Lining': '100% Polyester Taffeta',
      'Fit': 'Slim Fit',
      'Closure': '2 Buttons',
      'Wash Care': 'Dry clean only'
    },
    colors: [
      { name: 'Navy Blue', hex: '#0F172A' },
      { name: 'Charcoal Grey', hex: '#334155' },
      { name: 'Beige', hex: '#C29B38' }
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)']
  }
];

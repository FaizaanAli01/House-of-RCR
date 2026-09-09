class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search && this.queryString.search.trim()) {
      const keyword = this.queryString.search.trim();
      const regex = new RegExp(keyword, 'i');
      this.query = this.query.find({
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
          { brand: { $regex: regex } },
          { category: { $regex: regex } },
          { subcategory: { $regex: regex } },
        ],
      });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };

    // Fields to exclude from direct matching
    const removeFields = ['search', 'sort', 'page', 'limit', 'fields'];
    removeFields.forEach((el) => delete queryCopy[el]);

    const mongoQuery = {};

    // Category filter
    if (queryCopy.category && queryCopy.category !== 'all') {
      mongoQuery.$or = [
        { categorySlug: queryCopy.category },
        { category: new RegExp(queryCopy.category, 'i') },
      ];
    }

    // Brand filter (supports comma-separated list)
    if (queryCopy.brand) {
      const brands = queryCopy.brand.split(',').map((b) => b.trim());
      mongoQuery.brand = { $in: brands };
    }

    // Min / Max Price filter
    if (queryCopy.minPrice || queryCopy.maxPrice) {
      mongoQuery.price = {};
      if (queryCopy.minPrice) mongoQuery.price.$gte = Number(queryCopy.minPrice);
      if (queryCopy.maxPrice) mongoQuery.price.$lte = Number(queryCopy.maxPrice);
    }

    // Rating filter
    if (queryCopy.minRating) {
      mongoQuery.rating = { $gte: Number(queryCopy.minRating) };
    }

    // Deals filter
    if (queryCopy.deals === 'true' || queryCopy.filter === 'deals') {
      mongoQuery.isDeal = true;
    }

    // New Arrivals filter
    if (queryCopy.newArrivals === 'true' || queryCopy.filter === 'new') {
      mongoQuery.isNewArrival = true;
    }

    // Featured filter
    if (queryCopy.featured === 'true') {
      mongoQuery.isFeatured = true;
    }

    // In-Stock filter
    if (queryCopy.inStock === 'true' || queryCopy.onlyInStock === 'true') {
      mongoQuery.stock = { $gt: 0 };
    }

    this.query = this.query.find(mongoQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort;
      switch (sortBy) {
        case 'price-asc':
          this.query = this.query.sort('price');
          break;
        case 'price-desc':
          this.query = this.query.sort('-price');
          break;
        case 'rating':
          this.query = this.query.sort('-rating -reviewCount');
          break;
        case 'discount':
          this.query = this.query.sort('-discount');
          break;
        case 'newest':
          this.query = this.query.sort('-isNewArrival -createdAt');
          break;
        case 'featured':
        default:
          this.query = this.query.sort('-isFeatured -rating -createdAt');
          break;
      }
    } else {
      this.query = this.query.sort('-isFeatured -createdAt');
    }
    return this;
  }

  paginate(resPerPage = 50) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || resPerPage;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;

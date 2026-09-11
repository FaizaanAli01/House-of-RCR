import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 }, // price at time of purchase — never from frontend
    color: { type: String, default: 'Default' },
    size: { type: String, default: 'Free Size' },
    quantity: { type: Number, required: true, min: 1 },
    itemTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
 );

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, default: '', trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0, default: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    promoCode: { type: String, default: null },
    taxAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Auto-generate human-readable order number.
// Mongoose 9 sync pre-save hook: no next() parameter or call needed.
orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.orderNumber = `RCR-${ts}-${rand}`;
  }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

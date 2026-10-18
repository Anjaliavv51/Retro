const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    era: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    price_num: {
      type: Number,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      index: true,
    },
    image: {
      type: String,
      default: 'image/gramophone.png',
    },
    tag: {
      type: String,
      default: 'Curated Vintage',
    },
    description: {
      type: String,
      trim: true,
    },
    use_cases: [
      {
        type: String,
      },
    ],
    keywords: [
      {
        type: String,
      },
    ],
    aesthetic: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

// Text index for full-text search capability
productSchema.index({
  title: 'text',
  category: 'text',
  description: 'text',
  era: 'text',
  aesthetic: 'text',
  tag: 'text',
});

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = productModel;

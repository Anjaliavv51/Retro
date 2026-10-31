/**
 * Automated Schema Integrity & Model Validation Tests
 * Verified by Retro Maintenance Agent: 2026-10-31
 */

// Node 26 compatibility
const bufferModule = require('buffer');
if (!bufferModule.SlowBuffer) bufferModule.SlowBuffer = bufferModule.Buffer;
if (typeof SlowBuffer === 'undefined') global.SlowBuffer = bufferModule.Buffer;

const assert = require('assert');
const mongoose = require('mongoose');
const Product = require('../model/productSchema.js');
const Review = require('../model/reviewSchema.js');

async function runSchemaTests() {
  console.log('🧪 Running Schema Validation Tests...');

  // Test 1: Product Schema Validation
  const validProduct = new Product({
    id: 'test-101',
    title: 'Test Gramophone',
    category: 'Audio',
    price: '$99.00',
    price_num: 99.00,
    rating: 4.8
  });
  const prodErr = validProduct.validateSync();
  assert(!prodErr, 'Valid product should have no validation errors');

  // Test 2: Product Missing Required Fields
  const invalidProduct = new Product({ rating: 4.5 });
  const missingErr = invalidProduct.validateSync();
  assert(missingErr && missingErr.errors.title, 'Should require title');
  assert(missingErr && missingErr.errors.category, 'Should require category');
  assert(missingErr && missingErr.errors.price_num, 'Should require price_num');

  // Test 3: Review Schema Validation
  const validReview = new Review({
    name: 'Vintage Enthusiast',
    rating: 5,
    comment: 'Pristine historical piece!'
  });
  const revErr = validReview.validateSync();
  assert(!revErr, 'Valid review should have no validation errors');

  // Test 4: Review Rating Clamping
  const invalidReview = new Review({
    name: 'Collector',
    rating: 10,
    comment: 'Too high'
  });
  const ratingErr = invalidReview.validateSync();
  assert(ratingErr && ratingErr.errors.rating, 'Rating cannot exceed 5');

  console.log('✅ All Schema Validation Tests Passed Successfully!');
}

runSchemaTests().catch(err => {
  console.error('❌ Schema Test Failed:', err);
  process.exit(1);
});

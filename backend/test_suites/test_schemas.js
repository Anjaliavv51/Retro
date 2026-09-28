/**
 * Automated Schema Integrity & Model Validation Tests
 * Verified by Retro Maintenance Agent: 2026-09-28
 */

const bufferModule = require('buffer');
if (!bufferModule.SlowBuffer) bufferModule.SlowBuffer = bufferModule.Buffer;
if (typeof SlowBuffer === 'undefined') global.SlowBuffer = bufferModule.Buffer;

const assert = require('assert');
const mongoose = require('mongoose');
const Product = require('../model/productSchema.js');
const Review = require('../model/reviewSchema.js');

async function runSchemaTests() {
  console.log('🧪 Running Schema Validation Tests...');

  const validProduct = new Product({
    id: 'test-101',
    title: 'Test Gramophone',
    category: 'Audio',
    price: '$99.00',
    price_num: 99.00,
    rating: 4.8
  });
  const prodErr = validProduct.validateSync();
  assert.strictEqual(prodErr, undefined, 'Valid product should pass schema validation');

  console.log('✅ All model schema tests passed.');
}

module.exports = { runSchemaTests };

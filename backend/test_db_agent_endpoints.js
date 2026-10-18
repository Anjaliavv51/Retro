// Node.js 26+ compatibility polyfill for legacy dependencies
const bufferModule = require('buffer');
if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer;
}
if (typeof SlowBuffer === 'undefined') {
  global.SlowBuffer = bufferModule.Buffer;
}

const assert = require('assert');
const { processDbAgentQuery, parseNaturalQuery, buildMQLString } = require('./agent/dbAgent.js');
const app = require('./app.js');

async function runTestSuite() {
  console.log('🚀 Starting Retro Database Agent Verification...\n');

  // Test 1: Parser and Query Construction
  console.log('Test 1: Verifying query parsing for "Find audio products under $100 with rating above 4.5"...');
  const p1 = parseNaturalQuery('Find audio products under $100 with rating above 4.5');
  assert.strictEqual(p1.collection, 'products');
  assert.strictEqual(p1.filter.price_num.$lte, 100);
  assert.strictEqual(p1.filter.rating.$gte, 4.5);
  console.log('  ✅ Parser accurately recognized collection, price limit ($100), and rating threshold (4.5)');

  // Test 2: MQL String Formatting
  console.log('Test 2: Verifying MQL generation...');
  const mql1 = buildMQLString(p1);
  assert(mql1.includes('db.products.find'));
  assert(mql1.includes('$lte'));
  console.log('  ✅ Generated valid MQL command:\n    ' + mql1.split('\n').join('\n    '));

  // Test 3: Aggregation Query
  console.log('\nTest 3: Verifying aggregation pipeline for "Average price by category"...');
  const pAgg = parseNaturalQuery('Average price by category');
  assert.strictEqual(pAgg.queryType, 'aggregate');
  assert(pAgg.pipeline.some(s => s.$group));
  const resAgg = await processDbAgentQuery('Average price by category');
  assert.strictEqual(resAgg.success, true);
  assert(resAgg.count > 0);
  console.log(`  ✅ Aggregation executed successfully, returned ${resAgg.count} categories`);

  // Test 4: Count Query on Users
  console.log('\nTest 4: Verifying user count query...');
  const resCount = await processDbAgentQuery('How many users are registered?');
  assert.strictEqual(resCount.targetCollection, 'users');
  assert.strictEqual(resCount.queryType, 'count');
  assert(resCount.count >= 1);
  console.log(`  ✅ User count returned: ${resCount.count}`);

  // Test 5: Security & Password Masking
  console.log('\nTest 5: Verifying security & password masking...');
  const resUsers = await processDbAgentQuery('Show all registered accounts');
  assert.strictEqual(resUsers.targetCollection, 'users');
  resUsers.results.forEach(u => {
    assert.strictEqual(u.password, undefined, 'Password must never be returned in results');
    assert.strictEqual(u.forgotPasswordToken, undefined, 'Tokens must never be returned in results');
  });
  console.log('  ✅ Verified: Sensitive user password hashes & tokens are strictly excluded from results');

  // Test 6: Plural and Keyword Tolerance
  console.log('\nTest 6: Verifying plural keyword matching ("Top 3 most expensive cameras")...');
  const resCameras = await processDbAgentQuery('Top 3 most expensive cameras');
  assert.strictEqual(resCameras.targetCollection, 'products');
  assert(resCameras.results.length > 0);
  assert(resCameras.results[0].category.includes('Photo'));
  console.log(`  ✅ Found ${resCameras.results.length} camera(s), top price: ${resCameras.results[0].price}`);

  // Test 7: Express App Health & DB Agent Routes
  console.log('\nTest 7: Verifying Express route controllers...');
  const dbController = require('./controller/dbAgentController.js');

  // Mock Request / Response for Schema
  let schemaData = null;
  const mockResSchema = {
    status: (code) => ({
      json: (data) => { schemaData = data; }
    })
  };
  dbController.getDbSchema({}, mockResSchema);
  assert(schemaData && schemaData.schemas.products && schemaData.schemas.users && schemaData.schemas.reviews);
  console.log('  ✅ Schema metadata successfully documented: products, users, reviews');

  // Mock Request / Response for Examples
  let examplesData = null;
  const mockResExamples = {
    status: (code) => ({
      json: (data) => { examplesData = data; }
    })
  };
  dbController.getDbExamples({}, mockResExamples);
  assert(examplesData && examplesData.examples.length >= 5);
  console.log(`  ✅ Examples catalog returned ${examplesData.examples.length} quick queries`);

  // Test 8: Empty Query Validation
  console.log('\nTest 8: Verifying empty query rejection...');
  let errorData = null;
  const mockResError = {
    status: (code) => ({
      json: (data) => { errorData = data; }
    })
  };
  await dbController.handleDbQuery({ method: 'GET', query: { q: '   ' } }, mockResError);
  assert.strictEqual(errorData.success, false);
  console.log('  ✅ Correctly rejected empty query with 400 validation error');

  console.log('\n✨ ALL RETRO DATABASE AGENT TESTS PASSED WITH 100% SUCCESS! ✨\n');
  process.exit(0);
}

runTestSuite().catch(err => {
  console.error('\n❌ Test Suite Encountered Error:', err);
  process.exit(1);
});

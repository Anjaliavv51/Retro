// Node.js 26+ compatibility polyfill for legacy dependencies
const bufferModule = require('buffer');
if (!bufferModule.SlowBuffer) {
  bufferModule.SlowBuffer = bufferModule.Buffer;
}
if (typeof SlowBuffer === 'undefined') {
  global.SlowBuffer = bufferModule.Buffer;
}

require('dotenv').config();
const PORT  = process.env.PORT || 5000;


const app = require('./app.js');
app.listen(PORT,()=>{
    console.log(`server is listening at http://localhost:${PORT}`);
})
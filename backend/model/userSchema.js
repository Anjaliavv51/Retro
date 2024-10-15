const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, 'user name is Required'],

      trim: true,
    },
    email: {
      type: String,
      required: [true, 'user email is required'],
      unique: true,
      lowercase: true,
      unique: [true, 'already registered'],
    },
    password: {
      type: String,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  // If password is not modified then do not hash it
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

// FIXME: Check if these methods are working as expected
userSchema.methods = {
  //method for generating the jwt token
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this.email },
      process.env.SECRET,
      { expiresIn: '24h' } // 24 hours
    );
  },

  //userSchema method for generating and return forgotPassword token
  getForgotPasswordToken() {
    const forgotToken = crypto.randomBytes(20).toString('hex');
    //step 1 - save to DB
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(forgotToken)
      .digest('hex');

    /// forgot password expiry date
    this.forgotPasswordExpiryDate = Date.now() + 20 * 60 * 1000; // 20min

    //step 2 - return values to user
    return forgotToken;
  },
};

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;

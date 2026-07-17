// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 'البريد الإلكتروني مستخدم بالفعل', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      role: role || 'customer'
    });

    const token = generateToken(user._id);

    sendSuccess(res, 'تم التسجيل بنجاح', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    }, 201);
  } catch (error) {
    console.error('Register Error:', error);
    sendError(res, 'فشل التسجيل، تأكد من البيانات', 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return sendError(res, 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
    }

    const token = generateToken(user._id);

    sendSuccess(res, 'تم تسجيل الدخول بنجاح', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    sendError(res, 'فشل تسجيل الدخول', 500);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return sendError(res, 'المستخدم غير موجود', 404);
    }
    sendSuccess(res, 'بيانات المستخدم', { user });
  } catch (error) {
    console.error('GetMe Error:', error);
    sendError(res, 'فشل جلب البيانات', 500);
  }
};
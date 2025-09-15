const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    register(req, res, next);
  });

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res, next) => {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    login(req, res, next);
  });

module.exports = router;

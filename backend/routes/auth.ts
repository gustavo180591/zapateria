import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../validations/authValidation';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(loginSchema), login);

export default router;

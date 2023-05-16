const router = require('express').Router();
const {
  updateProfile, updateAvatar, getUsers, getUserById,
} = require('../controllers/users');
const authMiddleware = require('../middlewares/auth');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', authMiddleware, updateAvatar);

module.exports = router;

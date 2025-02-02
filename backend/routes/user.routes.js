const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { getProfile, editProfile, deleteProfile } = require('../controllers/profile.controller');

router.post('/signup', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 characters long')
], async (req, res) => {
    userController.userSignup(req, res);
});

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 characters long')
], async (req, res) => {
    userController.userLogin(req, res);
});

router.get('/logout', authMiddleware.authUser, async (req, res) => {
    userController.userLogout(req, res);
});


router.get('/checkLogin', authMiddleware.authUser, (req, res) => {
    res.status(200).json({ user: req.user });
});

router.get('/getprofile', authMiddleware.authUser, async (req,res) => {
    getProfile(req,res)
})

router.post('/editprofile', authMiddleware.authUser, async (req,res) => {
    editProfile(req,res)
})

router.delete('/deleteprofile', authMiddleware.authUser, async (req,res) => {
    deleteProfile(req,res)
})
module.exports = router;
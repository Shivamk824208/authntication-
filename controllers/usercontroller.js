const verifiyMail = require('../emailVerify/verifyMail');
const User = require('../models/usermodel.js');
const Session = require('../models/sessionModel.js');
const sendOtpEmail = require('../emailVerify/sendOtpMail.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            isVerified: false
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "10m" }
        );

        newUser.token = token;
        await newUser.save();

        await verifiyMail(token, newUser.email);

        return res.status(201).json({
            message: 'user registered successfully, please verify your email'
        });
        

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'authorization token missing' });
        }

        const token = authHeader.split(' ')[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ message: 'invalid or expired token' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        user.token = null;
        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: 'Email verified successfully' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid password" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "please verify your email" });
        }

        await Session.deleteOne({ userId: user._id });
        await Session.create({ userId: user._id });

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "10d" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
        );

        user.isLoggedIn = true;
        await user.save();

        return res.status(200).json({
            message: `welcome back ${user.name}`,
            accessToken,
            refreshToken,
            user
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const logoutUser = async (req, res) => {
    try{
      const userId = req.user.id;
      await Session.deleteOne({ userId: req.user._id });
      const user = await User.findById(userId);
      user.isLoggedIn = false;
      await user.save();
      return res.status(200).json({ message: 'logout successful'});
    }catch(err){
         return res.status(500).json({ message: err.message});
    }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await sendOtpEmail(otp, email);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

   
    return res.status(200).json({ message: 'OTP sent to your email' });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const verifyOTP = async (req, res) => {
    
        const {otp} = req.body;
         const email = req.params.email;
         if(!otp){
            return res.status(400).json({ message: 'otp is required'});
         }
         try{
            const user = await User.findOne({email});
            if(!user){
                return res.status(404).json({ message: 'user not found'});
            }
            if(!user.otp || !user.otpExpiry){
                return res.status(400).json({ message: 'otp not requested'});
            }
          if(user.otpExpiry < Date.now()){
            return res.status(400).json({ message: 'otp expired'});

          }
          if(otp !== user.otp){
            return res.status(400).json({ message: 'invalid otp'});
        
          }
           user.otp = null;
           user.otpExpiry = null;
           await user.save();
           return res.status(200).json({ message: 'otp verified successfully'});

    }catch(err){
        return res.status(500).json({ message: err.message });

    }
}

const changePassword = async (req, res) => {
    const { newPassword, confirmPassword} = req.body;
    const email = req.params.email;

    if(!newPassword || !confirmPassword){
        return res.status(400).json({ message: 'all fildes are required'});
    }
    if(newPassword !== confirmPassword){
        return res.status(400).json({ message: 'passwords do not match'});

    }
    try{
        const user = await User.findOne({ email});
        if(!user){
            return res.status(404).json({ message: 'user not found'});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'password changed successfully'});
    }catch(err){
        return res.status(500).json({ message: err.message});
    }
}



module.exports = { registerUser, verification, loginUser, logoutUser, forgotPassword, verifyOTP, changePassword };
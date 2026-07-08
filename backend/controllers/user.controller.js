
import Userdata from "../Models/User.model.js";
import generatorToken from "../utiles/generateTokenId.js";
import validator from "validator";
import bcrypt from "bcryptjs";

//  Register 
// register function — new user create garna
const register = async (req, res) => {
  try {
  // check garna k k aako xa vanera 
    const { firstName, lastName, email, phoneNumber, password, isAdmin } = req.body;

    //  Missing fields check
    // sabai required fields aayo ki aayena check garchha
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required. || missing details" });
    };

    //  Name trim check
    // user le space matra halyo bhane rokchha
    if (!firstName.trim() || !lastName.trim()) {
      return res.status(400).json({ message: "Name cannot be empty spaces." });
    };

    // add in 
      // os user le input garda space diyeni farak pardhaina
    const name=`${firstName} ${lastName}` // so usermodel ma apply gareko xa 
    if(!name || name.trim() === ' ')
    if(!name){
        return res.status(400).json({errormessage:"please name fullfill"})
    };
    if(!validator.isMobilePhone(phoneNumber)){
        return res.status(400).json({errormessage:"please enter a valid phone number!"})
    };


    //  Email validation
    // validator package le email format check garchha
    // ex: "abc@gmail.com" — valid, "abcgmail" — invalid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    };


    // Phone validation
    // phoneNumber Number type cha model ma, validator lai String chahincha
    // tesaile String() ma wrap gareko
   if (!validator.isMobilePhone(String(phoneNumber), "ne-NP")) {
  return res.status(400).json({ message: "Please enter a valid Nepal phone number." });
};



    // Password strength check
    // isStrongPassword le check garchha:
    // — minimum 8 characters in includeing  lowercase , uppercase , number, character etc
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
      });
    }

    //  Duplicate email check
    // database ma already tyhi email cha ki chaina
    const emailExists = await Userdata.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    //  Duplicate phone check
    // database ma already tyhi phone number cha ki chaina
    const phoneExists = await Userdata.findOne({ phoneNumber });
    if (phoneExists) {
      return res.status(400).json({ message: "This phone number is already registered." });
    }

    //  Create user
    // sabai validation pass bhayo — ab database ma save garchha
    const newUser = await Userdata.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password, // model ko pre('save') hook le auto-hash garchha
      isAdmin,
    });

    //  Generate JWT token
    // login session ko lagi cookie ma token set garchha
    const token = generatorToken(newUser._id, res);

    //  Send success response
    // password fields response ma pathaunu hudaina — security risk
    res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id:         newUser._id,
        name:        newUser.name,   // virtual field — firstName + lastName
        email:       newUser.email,
        phoneNumber: newUser.phoneNumber,
        isAdmin:     newUser.isAdmin,
      },
    });

  } catch (err) {
    // Unexpected server error
    // err.message directly npathaunu — security leak huna sakcha
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
  
//  Login  system 
// login function — existing user authenticate garna
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Missing fields check
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    //  Email format check
    // database query garnu agadi format valid cha ki chaina check
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    //  Find user by email
    // email database ma xa ki xaina
    const user = await Userdata.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email." });
    }

    // Step Password compare
    // user le deko password lai stored hashed password sanga compare garchha
    // comparePassword — User model ma defined method ho
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    //  Generate JWT token
    // TOKEN GENERATE
    const token = generatorToken(user._id, res);

    res.status(200).json({
      message: " You are Login successfully.",
      user: {
        _id:         user._id,
        name:        user.name,
        email:       user.email,
        phoneNumber: user.phoneNumber,
        isAdmin:     user.isAdmin,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

//  Logout 
// logout function — cookie clear garera session destroy garchha
const logout = async (req, res) => {
  try {
    // jwtcookies naam ko cookie clear garchha
    // httpOnly: true — JavaScript le cookie access garna napaaos
    res.clearCookie("jwtcookies", {
       httpOnly: true
       });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    // res.status(500).json({ message: "Server error. Please try again." });
    res.status(500).json({error:err?.data?.error?.message });

  }
};

//  Get Profile 
// getProfile   logged in user ko profile fetch garchha
// req.user   authMiddleware le set gareko hunchha (JWT token verify garerapachi)
const getprofile = async (req, res) => {
  try {
    const user = req.user;

    // authMiddleware pass bhayena bhane user hunchaina
    if (!user) {
      return res.status(404).json({ message: "User not found. Please login." });
    }

    res.status(200).json({
      message: "Profile fetched successfully.",
      user: {
        _id:         user._id,
        name:        user.name,
        email:       user.email,
        phoneNumber: user.phoneNumber,
        isAdmin:     user.isAdmin,
        image:       user.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

//  Update Profile 
// updateProfile   logged in user ko details update garchha
const updateprofile = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;

    // req.user._id — authMiddleware le JWT token bata extract gareko
    const userId = req.user._id;

    //  Find user by ID
    const user = await Userdata.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //   Email validation
    // email aayo bhane matra check garchha — optional field
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }

      //  Duplicate email check
      // aafno  email sanga match garyo bhane skip garchha
      // aruko email sanga match garyo bhane error
      if (email !== user.email) {
        const emailExists = await Userdata.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "This email is already in use." });
        }
      }
    }

    //  Phone validation
    if (phoneNumber) {
      if (!validator.isMobilePhone(String(phoneNumber))) {
        return res.status(400).json({ message: "Please enter a valid phone number." });
      }

      //  Duplicate phone check
      // String() ma convert — model ma Number type cha
      if (String(phoneNumber) !== String(user.phoneNumber)) {
        const phoneExists = await Userdata.findOne({ phoneNumber });
        if (phoneExists) {
          return res.status(400).json({ message: "This phone number is already in use." });
        }
      }
    }

    // Password validation
    if (password) {
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
        });
      }

      //  Confirm password match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }
    }

    //  Update fields
    // || operator  naya value aayena bhane purano value rakhchha
    user.firstName   = firstName   || user.firstName;
    user.lastName    = lastName    || user.lastName;
    user.email       = email       || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    //  Password update
    // plain text assign garchha — pre('save') hook le auto-hash garchha
    // manual bcrypt.hash() garnupardaina — model le handle garchha
    if (password) user.password = password;

    //  Save to database
    // pre('save') hook trigger hunchha — password automatically hash hunchha
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id:         user._id,
        name:        user.name,
        email:       user.email,
        phoneNumber: user.phoneNumber,
        isAdmin:     user.isAdmin,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export { register, login, logout, getprofile, updateprofile };
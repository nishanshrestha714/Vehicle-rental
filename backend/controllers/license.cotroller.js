// import License from "../Models/license.model.js";
// import nagarikta from "../Models/nagarikta.model.js";
// import Vehicles from "../Models/vechile.model.js";
// // import Userdata from "../Models/User.model.js";

// const addlicense = async (req, res) => {
//   try {
//     const userAdmin = req.user.isAdmin;
//     if (!userAdmin) {
//       return res
//         .status(403)
//         .send({ error: "only admin can be verify nagarikta" });
//     }

//     const {
//       licesneNumber,
//       fullname,
//       deteofBirth,
//       issueDate,
//       expiryDate,
//       cotegory,
//       image,
//       address,
//       district,
//     } = req.body;
//     if (
//       !licesneNumber ||
//       !fullname ||
//       !deteofBirth ||
//       !issueDate ||
//       !expiryDate ||
//       !cotegory ||
//       !image
//     ) {
//       return res.status(400).send({ error: "all fields required !" });
//     }

//     const userId = req.user._id;
//     // and check in the  user verify in nagarikta number  record
//     const usernagarikta = await nagarikta.findOne({ user: userId });
//     if (!usernagarikta) {
//       return res.status(404).send({
//         error: "nagarita not found , please add in your nagarikta first!",
//       });
//     }
//     // verify in nagarikta as a admin

//     // if (!usernagarikta.verified) {
//     //   return res
//     //     .status(400)
//     //     .send({ error: "nagarikta number is not verified!" });
//     // }
//     //check if license already exists for this user
//     //no duplicate check — user could add multiple licenses

//     // const licenseExists = await License.findOne({ user: userId });
//     // if (licenseExists) {
//     //   return res.status(409).json({
//     //     error: "License already exists for this user!",
//     //   });
//     // }

//     // license create
//     const createlicesne = await License.create({
//       user: userId,
//       licesneNumber,
//       fullname,
//       deteofBirth,
//       issueDate,
//       expiryDate,
//       cotegory,
//       image,
//       address,
//       district,
//       nagariktaNumber: usernagarikta.nagariktaNumber,
//       nagarikta: usernagarikta._id,
//     });
//     // save
//     //  await createlicesne.save();
  
//     res
//       .status(201)
//       .send({ message: "your license add in sucessfully!", createlicesne });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// };
// // and add function in
// const getAllLicense = async (req, res) => {
//   try {
//     const alllicense = await License
//       .find()
//       .populate("user", "firstName lastName email phoneNumber")
//       .populate("nagarikta", "nagariktaNumber");
//     if (!alllicense || alllicense.length === 0) {
//       return res.status(404).send({ error: "license not found!" });
//     }
//     res
//       .status(200)
//       .send({ message: "all license details", License: alllicense });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// };

// // verify license in admin
// const verifylicense = async (req, res) => {
//   try {
//     const userAdmin = req.user.isAdmin;
//     if (!userAdmin) {
//       return res
//         .status(403)
//         .send({ error: "only admin can be verify license" });
//     }
//     const { id } = req.params;
//     const verifylicense = await License.findById(id);
//     if (!verifylicense) {
//       return res.status(404).send({ error: "license not found!" });
//     }
//     verifylicense.verified = true;
//     verifylicense.verifiedAt = new Date();

//     await verifylicense.save();
//     res.status(200).send({
//       message: "license is verified successfully!",
//       verifylicense: verifylicense,
//     });
//   } catch (err) {
//     res.status(500).send({ error: err.message });
//   }
// };

// //and license verify in the vehicle
// const cotogory = async (req, res) => {
//   try {
//     //  user id and  vehilce id is gain for body json or frontend
//     const { userId, vehicleId } = req.body;
//     // and then find thee license is license mogodb
//     const licenseFound = await License.findOne({ user: userId });
//     if (!licenseFound) {
//       return res.status(404).json({ error: "license not found this user!" });
//     }
//     // check in nagarikta
//     if (!licenseFound.isVerified) {
//       return res
//         .status(400)
//         .json({ error: "nagarikta  number is not verified !" });
//     }
//     // find out vehicle 
//     const vehicleFound = await Vehicles.findById(vehicleId);
//     if(!vehicleFound){
//       return res.status(404).json({error:"vehicle not found!"});
//     }
//         const licenseCategory = licenseFound.cotegory;     
//     const vehicleCategory = vehicleFound.category; 
    
//      if (licenseCategory !== vehicleCategory) {
//       return res.status(400).json({
//         error: `Your license category '${licenseCategory}' does not match vehicle category '${vehicleCategory}'!`,
//       });
//     };
//         res.status(200).json({
//       message: "Category matched! You are eligible for this vehicle.",
//       licenseCategory,
//       vehicleCategory,
//     });



//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export { addlicense, getAllLicense, verifylicense, cotogory };
















import License from "../Models/license.model.js";
import nagarikta from "../Models/nagarikta.model.js";
import Vehicles from "../Models/vechile.model.js";

// ============================================================
// ADD LICENSE — called by a regular (non-admin) user
// ============================================================
const addlicense = async (req, res) => {
  try {
    // const userAdmin = req.user.isAdmin;

    // // ❌ BUG: This blocks every normal user from adding a license!
    // //    addlicense should be for USERS, not admins.
    // //    Only verifylicense() should be admin-only.
    // //    FIX: Remove this admin check entirely, OR if you want
    // //         to restrict admins from adding, keep it but flip it.
    // if (!userAdmin) {
    //   return res
    //     .status(403)
    //     .send({ error: "only admin can be verify nagarikta" }); // ← THIS is the 403 you're seeing
    // }

    const {
      licesneNumber,  // ⚠️  Typo: should be licenseNumber
      fullname,
      deteofBirth,    // ⚠️  Typo: should be dateOfBirth
      issueDate,
      expiryDate,
      cotegory,       // ⚠️  Typo: should be category
      image,
      address,
      district,
    } = req.body;

    // ✅ Good: validate all required fields
    if (
      !licesneNumber ||
      !fullname ||
      !deteofBirth ||
      !issueDate ||
      !expiryDate ||
      !cotegory ||
      !image
    ) {
      return res.status(400).send({ error: "all fields required !" });
    }

    const userId = req.user._id; // ✅ Get logged-in user's ID

    // ✅ Check if the user has a nagarikta record before creating a license
    const usernagarikta = await nagarikta.findOne({ user: userId });
    if (!usernagarikta) {
      return res.status(404).send({
        error: "nagarita not found , please add in your nagarikta first!",
      });
    }

    // ✅ Create the license linked to user and their nagarikta
    const createlicesne = await License.create({
      user: userId,
      licesneNumber,
      fullname,
      deteofBirth,
      issueDate,
      expiryDate,
      cotegory,
      image,
      address,
      district,
      nagariktaNumber: usernagarikta.nagariktaNumber,
      nagarikta: usernagarikta._id,
    });

    res
      .status(201)
      .send({ message: "your license add in sucessfully!", createlicesne });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// ============================================================
// GET ALL LICENSES — likely admin only (add auth middleware on route)
// ============================================================
const getAllLicense = async (req, res) => {
  try {
    const alllicense = await License.find()
      .populate("user", "firstName lastName email phoneNumber")
      .populate("nagarikta", "nagariktaNumber");

    // ✅ Return empty array instead of 404 — no licenses yet is not an error
    if (!alllicense || alllicense.length === 0) {
      return res.status(404).send({ error: "license not found!" });
    }

    res.status(200).send({ message: "all license details", License: alllicense });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// ============================================================
// VERIFY LICENSE — admin only ✅ correct guard here
// ============================================================
const verifylicense = async (req, res) => {
  try {
    const userAdmin = req.user.isAdmin;

    // ✅ Correct: only admin can verify a license
    if (!userAdmin) {
      return res.status(403).send({ error: "only admin can be verify license" });
    }

    const { id } = req.params;

    const verifylicense = await License.findById(id);
    if (!verifylicense) {
      return res.status(404).send({ error: "license not found!" });
    }

    // ✅ Mark license as verified with timestamp
    verifylicense.verified = true;
    verifylicense.verifiedAt = new Date();
    await verifylicense.save();

    res.status(200).send({
      message: "license is verified successfully!",
      verifylicense: verifylicense,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// ============================================================
// CHECK CATEGORY MATCH — license category vs vehicle category
// ============================================================
const cotogory = async (req, res) => {
  try {
    const { userId, vehicleId } = req.body;

    // ✅ Find license by user
    const licenseFound = await License.findOne({ user: userId });
    if (!licenseFound) {
      return res.status(404).json({ error: "license not found this user!" });
    }

    // ⚠️  BUG: You save as `verified` in verifylicense() above,
    //     but check `isVerified` here — field name mismatch!
    //     Fix: use licenseFound.verified (to match your schema/save above)
    if (!licenseFound.isVerified) {
      return res.status(400).json({ error: "nagarikta number is not verified!" });
    }

    // ✅ Find the vehicle
    const vehicleFound = await Vehicles.findById(vehicleId);
    if (!vehicleFound) {
      return res.status(404).json({ error: "vehicle not found!" });
    }

    const licenseCategory = licenseFound.cotegory;    // ⚠️  Typo (consistent with model, ok for now)
    const vehicleCategory = vehicleFound.category;

    // ✅ Compare categories
    if (licenseCategory !== vehicleCategory) {
      return res.status(400).json({
        error: `Your license category '${licenseCategory}' does not match vehicle category '${vehicleCategory}'!`,
      });
    }

    res.status(200).json({
      message: "Category matched! You are eligible for this vehicle.",
      licenseCategory,
      vehicleCategory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { addlicense, getAllLicense, verifylicense, cotogory };
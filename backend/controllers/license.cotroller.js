
import License from "../Models/license.model.js";
import nagarikta from "../Models/nagarikta.model.js";
import Vehicles from "../Models/vechile.model.js";

// ADD LICENSE — called by a regular (non-admin) user

const addlicense = async (req, res) => {
  try {
    const {
      licesneNumber,
      fullname,
      issueDate,
      expiryDate,
      cotegory,
      image,
      nagariktaNumber,
    } = req.body;

    // validate all required fields
    if (
      !licesneNumber ||
      !fullname ||
      !issueDate ||
      !expiryDate ||
      !cotegory ||
      !image ||
      !nagariktaNumber
    ) {
      return res.status(400).send({ error: "all fields required !" });
    }

    // Get logged-in user's ID
    const userId = req.user._id;

    // Check if the user has a nagarikta record before creating a license
    const usernagarikta = await nagarikta.findOne({ user: userId });
    if (!usernagarikta) {
      return res.status(404).send({
        error: "nagarita not found , please add in your nagarikta first!",
      });
    }


        // if (!usernagarikta.verified) {
   //   return res
    //     .status(400)
    //     .send({ error: "nagarikta number is not verified!" });
     // }
     //     //check if license already exists for this user
   //no duplicate check — user could add multiple licenses

   // const licenseExists = await License.findOne({ user: userId });
   // if (licenseExists) {
   //   return res.status(409).json({
   //     error: "License already exists for this user!",
    //   });
    // }


   // nagarikta match test in db in user id to verify
    if (nagariktaNumber !== usernagarikta.nagariktaNumber) {
      return res.status(400).send({
        error: "Nagarikta number does not match your registered record!",
      });
    }
// license match test 
    const existingLicense = await License.findOne({ user: userId });
    if (existingLicense && licesneNumber !== existingLicense.licesneNumber) {
      return res.status(400).send({
        error:
          "License number does not match your existing registered license. You cannot change your registered license number.",
      });
    }
    const finalLicesneNumber = existingLicense
      ? existingLicense.licesneNumber
      : licesneNumber;

  
    const createlicesne = await License.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        licesneNumber: finalLicesneNumber,
        fullname,
        issueDate,
        expiryDate,
        cotegory,
        image,
        nagariktaNumber: usernagarikta.nagariktaNumber,
        nagarikta: usernagarikta._id,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.status(existingLicense ? 200 : 201).send({
      message: existingLicense
        ? "your license updated successfully!"
        : "your license add in sucessfully!",
      createlicesne,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0] || "field";
      const value = err.keyValue?.[field];
      return res.status(409).send({
        error: `A license with this ${field} (${value}) already exists.`,
      });
    }
    res.status(500).send({ error: err.message });
  }
};

// GET ALL LICENSES
// likely admin only (add auth middleware on route)
const getAllLicense = async (req, res) => {
  try {
    const userAdmin = req.user.isAdmin;

    // Only admin can view all licenses
    if (!userAdmin) {
      return res
        .status(403)
        .send({ error: "only admin can view all licenses" });
    }

    const alllicense = await License.find()
      .populate("user", "firstName lastName email phoneNumber")
      .populate("nagarikta", "nagariktaNumber");

    // Return empty array instead of 404 — no licenses yet is not an error
    if (!alllicense) {
      return res.status(404).send({ error: "license not found!" });
    }

    res
      .status(200)
      .send({ message: "all license details", License: alllicense });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// GET MY LICENSE — logged-in user's own license record
const getMyLicense = async (req, res) => {
  try {
    // const userId = req.user._id;
    const id = res.params.id;
    
    // const myLicense = await License.findOne({ user: userId }).populate(
    const myLicense = await License.findById(id).populate( 

      "nagarikta",
      "nagariktaNumber fullName issueDistrict",
    ).populate("user", "firstName lastName email phoneNumber");

    if (!myLicense) {
      return res.status(404).send({ error: "license not found, please add your license first!" });
    }

    res.status(200).send({
      message: "your license detail",
      license: myLicense,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


// VERIFY LICENSE — admin only
const verifylicense = async (req, res) => {
  try {
    const userAdmin = req.user.isAdmin;
 
    // Only admin can verify a license
    if (!userAdmin) {
      return res
        .status(403)
        .send({ error: "only admin can be verify license" });
    }

    const { id } = req.params;
 
  // check in license 
    const licenseDoc = await License.findById(id);
    if (!licenseDoc) {
      return res.status(404).send({ error: "license not found!" });
    }

    // Mark license as verified with timestamp
    licenseDoc.verified = true;
    licenseDoc.verifiedAt = new Date();
    await licenseDoc.save();

    res.status(200).send({
      message: "license is verified successfully!",
      verifylicense: licenseDoc,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};




// CHECK CATEGORY MATCH — license category vs vehicle category

const cotogory = async (req, res) => {
  try {
    const { userId, vehicleId } = req.body;

    // Find license by user
        // and then find thee license is license mogodb
    const licenseFound = await License.findOne({ user: userId });
    if (!licenseFound) {
      return res.status(404).json({ error: "license not found this user!" });
    }


    if (!licenseFound.verified) {
      return res
        .status(400)
        .json({ error: "License number is not verified!" });
    }

    // Find the vehicle
    const vehicleFound = await Vehicles.findById(vehicleId);
    if (!vehicleFound) {
      return res.status(404).json({ error: "vehicle not found!" });
    }

    const licenseCategory = licenseFound.cotegory;
    //vehicle documents store this as `licenseCategory`
    const vehicleCategory = vehicleFound.licenseCategory;

    // Compare categories
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

const  getLicenseById   = async (req,res) =>{
  try{  
    const id = res.params.id
     const license = await License.findById(id)
     .populate("nagarikta" , "nagariktaNumber fullName issueDistrict") 
     . populate("user", "firstName lastName email phoneNumber");

     if (license){
          return res.status(404).json({error:"license not found"})
     }

        res.status(200).send({
      message: "license detail",
      license: license,
    });


  }
  catch (err){
    res.status(500).json({error:err.message});
  }

} 
export { addlicense, getAllLicense,    getMyLicense,verifylicense, cotogory ,getLicenseById  };
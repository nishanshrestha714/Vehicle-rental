import Nagarikta from "../Models/nagarikta.model.js";

// add in nagarikta

const addNagarikta = async (req, res) => {
  try {
    const {
      nagariktaNumber,
      fullName,
      dateofBirth,
      permentAddress,
      issueDate,
      issueDistrict,
      frontImage,
      backImage,
    } = req.body;

    if (
      !nagariktaNumber ||
      !fullName ||
      !issueDate ||
      !dateofBirth ||
      !permentAddress ||
      !frontImage ||
      !backImage ||
      !issueDistrict
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // checking if  the exact nagarikta number is already exits or not
    const identityExit = await Nagarikta.findOne({ nagariktaNumber });
    if (identityExit) {
      return res
        .status(409)
        .json({ error: "A  nagarikta card number is already register" });
    }

    const newnagarikta = await Nagarikta.create({
      user: req.user._id,
      nagariktaNumber,
      fullName,
      dateofBirth,
      permentAddress,
      issueDate,
      issueDistrict,
      frontImage,
      backImage,
    });

    // await newnagarikta.save();
    res
      .status(201)
      .json({ message: "add in nagarikta sucess", userNarikta: newnagarikta });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Internal server error occurred processing request",
    });
  }
};
// verify in nagarikta in admin
const verifynagarikta = async (req, res) => {
  try {
    const { id } = req.params;

    // check in admin only
    const user = req.user.isAdmin;
    if (!user)
      return res
        .status(403)
        .send({ error: "you are not aurthorized to verify nagarikta" });

    const citizen = await Nagarikta.findById(id);
    if (!citizen)
      return res.status(404).send({ error: "nagarikta not found!" });
 
    // nagarikta is valid
    citizen.verified = true;
    citizen.verifiedAt = new Date();
    citizen.verifiedBy = req.user._id;
    await citizen.save();

    res.status(200).send({
      message: "Nagarikta verified successfully!",
      verifiedBy: req.user._id,
      verifiedAt: citizen.verifiedAt,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
// get nagarikta
const getNagarikta = async (req, res) => {
  try {
    const nagariktaget = await Nagarikta
      .find()
      .populate("user", "firstName lastName phoneNumber email -_id");

    if (!nagariktaget || nagariktaget.length === 0)
      return res.status(404).json({ error: "No nagarikta found" });

    res.status(200).json({ message: "nagarikta list", nagariktaget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get my nagarikta add in controllers
const getMyNagariktaStatus = async (req, res) => {
  try {
    const myNagarikta = await Nagarikta.findOne({ user: req.user._id });

    if (!myNagarikta)
      return res.status(404).json({ error: "Not submitted yet" });

    res.status(200).json({
      isVerified: myNagarikta.verified,
      verifiedAt: myNagarikta.verifiedAt,
      status: myNagarikta.verified ? "verified" : "pending",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update in nagarikta

const updatenagarikta = async (req, res) => {
  try {
    const {
      nagariktaNumber,
      fullName,
      dateofBirth,
      permentAddress,
      issueDate,
      issueDistrict,
      frontImage,
      backImage,
    } = req.body;

    //  valid
    if (
      !nagariktaNumber ||
      !fullName ||
      !dateofBirth ||
      !permentAddress ||
      !issueDate ||
      !issueDistrict ||
      !frontImage ||
      !backImage
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { id } = req.params;
    const upNagarikta = await Nagarikta.findById(id);
    if (!upNagarikta)
      return res.status(404).send({ error: "nagarikta not found" });

    upNagarikta.nagariktaNumber =
      nagariktaNumber || upNagarikta.nagariktaNumber;
    upNagarikta.fullName = fullName || upNagarikta.fullName;
    upNagarikta.dateofBirth = dateofBirth || upNagarikta.dateofBirth;
    upNagarikta.permentAddress = permentAddress || upNagarikta.permentAddress;
    upNagarikta.issueDate = issueDate || upNagarikta.issueDate;
    upNagarikta.issueDistrict = issueDistrict || upNagarikta.issueDistrict;
    upNagarikta.frontImage = frontImage || upNagarikta.frontImage;
    upNagarikta.backImage = backImage || upNagarikta.backImage;

    await upNagarikta.save();

    res.status(200).send({ message: "update in your nagarikta", upNagarikta });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

//delete

const deleteNagarikta = async (req, res) => {
  try {
    const { id } = req.params;

    const deletecitiz = await Nagarikta.findByIdAndDelete(id);
    if (!deletecitiz)
      return res.status(404).json({ error: "nagarikta not found" });

    res.status(200).json({ message: "nagarikta deleted succcessfull!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message || "Failed to delete nagarikta" });
  }
};
export {
  getNagarikta,
  addNagarikta,
  updatenagarikta,
  verifynagarikta,
  deleteNagarikta,
  getMyNagariktaStatus,
};

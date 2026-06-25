import Vehicles from "../Models/vechile.model.js";

// so vehicle  view in all

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicles.find();

    if (!vehicles) {
      return res.status(404).json({ error: "vehicle not found!" });
    }
    // vehicle valid
    res.status(200).json({ message: "vehicle list...", vehicles });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// and add vechile list form admin only added vechile



const addVechiles = async (req, res) => {
  try {
   const {
  name,
  vehicleNumber,
  vehicleType,
licenseCategory,
  discription,
  brand,
  gearSystem,
  model,
  year,
  mileage,
  fuelType,
  engineCC,
  price,
  color,
  image,
  vehicleDocument,
  insuranceExpiredDate,
  bluebookExpiredDate,
  rentPerHour,
  location,
} = req.body;


// if (!license.category.includes(vehicle.requiredLicenseCategory)) {
//    return res.status(403).json({ error: "License category mismatch" });
// }


//const addVehicles = { user: req.user._id,
//  name: "sample name for vehicle", 
// vehicleNumber: "BA 87 PA 6545",// so vehile number is unique one time used only 
// vehicleType: "bike",
//  discription: "sample vechile discription",
//  brand: "sample brand ",
//  gearSystem: "manual", 
// model: "sampe model for vehicle", 
// year: 2023,
//  mileage: 0,
//  fuelType: "petrol", 
// engineCC: "sample vechile power cc ", 
// price: 0, color: "sample color", 
// image: "sample image.jpg",
//  vehicleDocument:
//  { documents: "vehicle document435.pdf", 
// insurance: "insurance_435.pdf",
//  bluebook: "bluebook_435 ", },
//  insuranceExpiredDate:"2025/12/12",
//  bluebookExpiredDate:"83/02/04", 
// rentPerHour: 500,
//  location: "ktm thimi", };


const userId = req.user._id;
if (!userId) return res.status(401).json({error:"user not login please login  and try again"});

  const isAdmin = req.user.isAdmin;
if(!userId || !isAdmin){
    return res.status(403).json({error:"only admin  add vehicle!"});
};


   const addVehicles = {
  user: req.user._id,
  name: name ? name : "sample name for vehicle",
  vehicleNumber: vehicleNumber ? vehicleNumber : "BA 87 PA 6545",
  vehicleType: vehicleType ? vehicleType : "bike",
  licenseCategory:licenseCategory ? licenseCategory:'A',
  discription: discription ? discription : "sample vehicle discription",
  brand: brand ? brand : "sample brand",
  gearSystem: gearSystem ? gearSystem : "manual",
  model: model ? model : "sample model",
  year: year ? year : 2023,
  mileage: mileage ? mileage : 0,
  fuelType: fuelType ? fuelType : "petrol",
  engineCC: engineCC ? engineCC : "150cc",
  price: price ? price : 0,
  color: color ? color : "sample color",
  image: image ? image : "sample image.jpg",

  vehicleDocument: {
    documents: vehicleDocument?.documents
      ? vehicleDocument.documents
      : "vehicle document435.pdf",

    insurance: vehicleDocument?.insurance
      ? vehicleDocument.insurance
      : "insurance_435.pdf",

    bluebook: vehicleDocument?.bluebook
      ? vehicleDocument.bluebook
      : "bluebook_435.pdf",
  },

  insuranceExpiredDate: insuranceExpiredDate
    ? insuranceExpiredDate
    : "2025/12/12",

  bluebookExpiredDate: bluebookExpiredDate
    ? bluebookExpiredDate
    : "83/02/04",

  rentPerHour: rentPerHour ? rentPerHour : 500,
  location: location ? location : "ktm thimi",
};



    const vehicleExists =  await Vehicles.findOne({ vehicleNumber: addVehicles.vehicleNumber });
    if (vehicleExists) {
      return res.status(404).json({ error: "you have already register in this number" });
    };

   const documentExists = await Vehicles.findOne({
  "vehicleDocument.documents": addVehicles.vehicleDocument.documents,
});

if (documentExists) {
  return res.status(400).json({
    error: "Vehicle document already registered",
  });
}


    const addvehicle = await Vehicles.create(addVehicles);
    res.status(200).json({
        message: "vehicle added successfully!",
        addVehicles:addvehicle,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// getvehicle by id



const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const VechileById = await Vehicles.findById(id).populate(
      "user",
      "firstName lastName email -_id",
    );
    if (VechileById) {
      return res
        .status(200)
        .json({ message: "your add by vehicles", VechileById });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", error: err.message });
  }
};

//so add in review system in add project 
 const addreview = async(req,res)=>{
  try{
    const {title, comment,rating}=req.body;
    if(!title || !comment){
      return res.status(400).send({error:"missing details in review"});
    }
    //and review check for 1 to max 5
    if (rating < 1 || rating > 5){
      return res.status(400).send({error:"rating must be between 1 to 5 only"});
    }
    const user = req.user._id;
    // chek user login or not 
    if(!user){
      return res.status(401).send({error:"user not login"})
    }
    const { vehicleId: reViewVehicleId } = req.params;
  // vehicle id check

    if (!reViewVehicleId) {
  return res.status(400).json({ error: "Vehicle ID is required in URL" });
}
    // so find the vehicle in vehicle list 
    const vehicle = await Vehicles.findById(reViewVehicleId);

    if(!vehicle) return res.status(404).send({error:"vehicle not found"});
    //and check you already review ro not 
    const alreadyreviewed =  vehicle.reviews.find((review)=>review.user.toString() == user);
    if(alreadyreviewed)
      return res.status(400).send({error:"you already review this vehilce"});

    // so not review xa vane review garna pauxa 
       vehicle.reviews.push({
        title,
        comment,
        rating,
        user
        
       });
      // await vehicle.save();
       vehicle.numReview += 1;
       // and so total rating calculate 

       const totalrating = vehicle.reviews.reduce((acc ,review) => acc + review.rating ,0);
       /// so calcuale in the reting avrage 
      vehicle.rating = (totalrating / vehicle.numReview).toFixed(2);
      await vehicle.save();

      // response 
     res.status(201).json({message:"Review added successfully"});

  }
  catch (err) {
    res
      .status(500)
      .json({ error: "internal server error", error: err.message });
  }
 }

// update vehicle
const UpdateVehicle = async (req, res) => {
  try {
    const {
      name,
      vehicleNumber,
      description,
      vehicleType,
      brand,
      gearSystem,
      model,
      year,
      mileage,
      fuelType,
      engineCC,
      price,
      color,
      image,
      vehicleDocument,
      rentPerHour,
      location,
      insuranceExpiredDate,
      bluebookExpiredDate,
    } = req.body;

    const { id } = req.params;
    const Vechile = await Vehicles.findById(id).populate("user","firstName lastName email -_id")
    if (!Vechile) {
      return res.status(404).json({ error: "vehicle not found!" });
    }

    // update key

    Vechile.name = name || Vechile.name;
    Vechile.vehicleNumber = vehicleNumber || Vechile.vehicleNumber;
    Vechile.description = description || Vechile.description;
    Vechile.vehicleType = vehicleType || Vechile.vehicleType;
    Vechile.brand = brand || Vechile.brand;
    Vechile.gearSystem = gearSystem || Vechile.gearSystem;
    Vechile.model = model || Vechile.model;
    Vechile.year = year || Vechile.year;
    Vechile.mileage = mileage || Vechile.mileage;
    Vechile.fuelType = fuelType || Vechile.fuelType;
    Vechile.engineCC = engineCC || Vechile.engineCC;
    Vechile.price = price || Vechile.price;
    Vechile.color = color || Vechile.color;
    Vechile.image = image || Vechile.image;
    Vechile.vehicleDocument = vehicleDocument || Vechile.vehicleDocument;
    Vechile.rentPerHour = rentPerHour || Vechile.rentPerHour;
    Vechile.location = location || Vechile.location;
    Vechile.insuranceExpiredDate = insuranceExpiredDate || Vechile.insuranceExpiredDate,
   Vechile.bluebookExpiredDate = bluebookExpiredDate || Vechile.bluebookExpiredDate 

    Vechile.save();

    res.status(200).json({message:"vehicle update data successfully!",Vechile})
  } catch (err) {
    res
      .status(400)
      .json({ error: "not update for vehicle", error: err.message });
  }
};


// vehicle delete 
const deleteVehicle = async(req,res)=>{
    try{
        const {id}= req.params;

        const deletedVehicle =  await Vehicles.findByIdAndDelete(id);
        if(!deletedVehicle){
            return res.status(404).json({error:"vehicle not found"})
        }
        res.status(200).json({message:"vehicle deleted succcessfull!"});

     }
     catch(err){
        res.status(500).send({error:"failed to delete vehicle!",error:err.message});
     }
};


export { getVehicles, addVechiles, getVehicleById, addreview,UpdateVehicle,deleteVehicle};

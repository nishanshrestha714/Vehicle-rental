import mongoose from 'mongoose';
import reviewSchema from './review.schema.js';

const vechilelist = new mongoose.Schema({
   
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Userdata"
    },
      // License:{
      //     type:mongoose.Schema.Types.ObjectId,
      //     required:true,
      //     ref:"License"
      //   },
     name:{
        type:String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200,
     },
     vehicleNumber:{
        type:String,
        required:true,
        unique:true
     },
// license: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function(licenseValue) {
//         // Map required categories to vehicle types
//         const allowed = {
//           bike: ['A', 'A1'],
//           scooter: ['A', 'A1'],
//           car: ['B'],
//           Bus: ['F', 'G']
//         };
//         // 'this.vehicleType' gets the chosen vehicle type
//         return allowed[this.vehicleType]?.includes(licenseValue);
//       },
//       message: props => `License category '${props.value}' is not allowed for this vehicle type.`
//     }
//   },

    
     vehicleType:{
        type:String,
        required:true,
        enum:['car','bike','scooter','Bus'],
        default:"car"

     },
      discription:{
        type:String,
     },
     licenseCategory:{
      type:String,
      enum:['A','B','C','D','K'], // A is bike  , B is car , C is truck
      required:true
     },

     available :{
      type : Boolean,
     },

      brand:{
        type:String,
        required:true,

      },
      gearSystem:{
        type:String,
        enum:['manual', 'auto-manual'],
        default:'manual',
      },

      model:{
        type:String,
        required:true,
      },
      year:{
        type:Number,
        required:true,
      },

      mileage:{
        type:String,// per km
        default:10  
      },
      fuelType:{
        type:String,
        enum:['petrol','diesel','electric'],
        default:'petrol'
      },
      engineCC:{
        type:String,
        default:0
      },
         // seatngCapacity  t:n
       price:{
        type:Number,
         required:true,
      },
       discountPrice:{
        type:String,
        default:0
         },

      color:{
        type:String,
        default: '',
      },

      rating:{
        type:Number,
        default:0,
        min:0,
        max:5

      },

      reviews:[reviewSchema],

      countInStock: {
      type: Number,
      default: 0,
    },
    seats:{
      type:Number,
      default:2

    },

    numReview: {
      type: Number,
      default: 0,
    },

      image:{
        type:String,
        required:true,
        default:"sample.jpg"
      },


   vehicleDocument:{
  documents:{
    type:String,
    required:false,
    default:"sample vehicle ducement"
  },
  insurance:{
    type:String,
    required:false,
    default:"sample  vehicle insurnace "
  },
  bluebook:{
    type:String,
    required:false,
    default:"sample bluebook "
  },

},
insuranceExpiredDate:{
  type:String,
  required:true,
  default:"2082/12/12"
},
bluebookExpiredDate:{
  type:String,
  required:true,
  default:"2083/03/12"
},

rentPerHour:{
type:Number,
required:true,
default:1000
},

location:{
  type:String,
  required:true
}

     
},{timestamps :true});

const Vehicles = mongoose.model("Vehicles",vechilelist);

export default  Vehicles;



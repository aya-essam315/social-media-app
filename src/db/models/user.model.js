
import { Schema, Types, model, mongoose } from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const defaultImage = path.join(__dirname, "src", "default", "OIP.webp");

export const roleTypes = { user: "user", admin: "admin", superAdmin:"super-admin" };
export const genderTypes = { male: "male", female: "female" };
export const provider = { google: "google", system: "system" };
const userSchema = new Schema({
    firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
   lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  resetPasswordOtp:{
    otp:{type:String},
    expiresAt:{type:Date}
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  provider:{type:String, enum: Object.values(provider), default: provider.system },
  confirmEmailOTP: String,
  password: {
    type: String,
    required: (data)=>{
    return data?.provider === provider.google? false:true
  }
  },
  phone: String,
  address: String,
  DOB: Date,
  image:{ type:String, default:defaultImage},
  coverImages: [String],
  gender: {
    type: String,
    enum: Object.values(genderTypes),
    default: genderTypes.male
  },
  role: {
    type: String,
    enum: Object.values(roleTypes),
    default: roleTypes.user
  },
  confirmEmail: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  changeCredentialsTime: Date,
   viewers:[{
    userId:Types.ObjectId,
    date:[Date]
   }],
   tempEmail:String,
   tempEmailOtp:String,
   twoStepVerification:{type:Boolean, default:false},
   twoStepVerificationCode: String,
   updatedBy:{type:Types.ObjectId},
   blockList:[{type:Types.ObjectId, ref:"User"}],
   friends:[{type:Types.ObjectId, ref:"User"}]
}, { timestamps: true , toJSON:{virtuals:true}, toObject:{virtuals:true}});


userSchema.virtual('userName').
  get(function() {
 
     return `${this.firstName} ${this.lastName}`; }).
  set(function(v) {
    // const firstName = v.split()


    
     const firstName = v.split(" ")[0];
    const lastName = v.split(" ")[1];
    this.set({ firstName, lastName });
    console.log({ firstName, lastName });
    

   
  });


export const UserModel = model("User", userSchema);


export const connections = new Map()




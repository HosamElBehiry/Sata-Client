const mongoose = require("mongoose");
const CouponsSchema = mongoose.Schema({
    code:{
        type:String,
        require:true,
    },
    isPrecent:{
        type:Boolean,
        default:true
    },
    amount:{
        type:Number,
        require:true
    },
    startDate:{
        type:String,
        default:""
    },
    endDate:{
        type:String,
        default:""
    },
    isActive:{
        type:Boolean,
        default:true
    }
},
{timestamps:true}
)
module.exports = mongoose.model('Coupons' , CouponsSchema)
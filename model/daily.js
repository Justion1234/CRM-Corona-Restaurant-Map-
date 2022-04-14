const mongoose = require('mongoose') 
const Schema = mongoose.Schema;  
const dailySchema = new Schema({

    TbCorona19CountStatusJCG: [String]
    
    });  
                     

module.exports = mongoose.model("daily", dailySchema);
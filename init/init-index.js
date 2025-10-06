const mongoose = require('mongoose');
const earlierdata = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        let data = earlierdata.map((obj)=>({...obj ,  owner: new mongoose.Types.ObjectId('68d04f78aceb8923db3e77cc')}))
       let datum =  await Listing.insertMany(data);
        return datum; 
        
    } catch (err) {
        console.error("Error initializing DB:", err);
    }
};

initDB() ;

module.exports = initDB;
// 
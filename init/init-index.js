// const mongoose = require('mongoose');
// require('dotenv').config({ path: '../.env' });

// const Listing = require('../models/listing.js');
// const Review = require('../models/review.js');
// const User = require('../models/user.js');


// // const OLD_OWNER_ID = "68d04f78aceb8923db3e77cc"; // change if you know the exact old id to replace
// // const NEW_OWNER_ID = "68e40d22ea3c0ec01b6563b6"; // your Atlas owner id


// const listingData = require('./data.js');
// const reviewData = require('./reviewsData.js');
// const userData = require('./usersData.js');

// async function main() {
//     try {
//         console.log("DB URL:", process.env.DB_URL);

//         await mongoose.connect(process.env.DB_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 30000 // 30 seconds
//         });
//         console.log('MongoDB Connected');

//         // await User.deleteMany({});
//         // await User.insertMany(userData);

//         // await Listing.deleteMany({});
//         // await Listing.insertMany(listingData.map(obj => ({
//         //     ...obj,
//         //   owner: new mongoose.Types.ObjectId('68d04f78aceb8923db3e77cc')// example: assign first user as owner
//         // })));
       
//   await Listing.updateMany(
//       { owner: mongoose.Types.ObjectId("68d04f78aceb8923db3e77cc") },
//       { $set: { owner: mongoose.Types.ObjectId("68e40d22ea3c0ec01b6563b6") } }
//     );
//         // await Review.deleteMany({});
//         // await Review.insertMany(reviewData);

//         // console.log('All collections inserted successfully!');
//         process.exit(0);
//     } catch (err) {
//         console.error('Error inserting data:', err);
//         process.exit(1);
//     }
// }

// main();



// const OLD_OWNER_ID = "68d04f78aceb8923db3e77cc"; // change if you know the exact old id to replace
// const NEW_OWNER_ID = "68e40d22ea3c0ec01b6563b6"; // your Atlas owner id

// // async function run() {
// //   try {
// //     if (!process.env.DB_URL) {
// //       throw new Error('DB_URL not found in .env');
// //     }
// //     await mongoose.connect(process.env.DB_URL);
// //     console.log('Connected to Atlas');

// //     // Update listings that have the OLD_OWNER_ID to the NEW_OWNER_ID
// //     const res1 = await Listing.updateMany(
// //       { owner: mongoose.Types.ObjectId(OLD_OWNER_ID) },
// //       { $set: { owner: mongoose.Types.ObjectId(NEW_OWNER_ID) } }
// //     );
// //     console.log('Updated listings with old owner id:', res1.modifiedCount, 'modified');

// //     // Additionally, update listings with null/missing owner
// //     const res2 = await Listing.updateMany(
// //       { $or: [ { owner: { $exists: false } }, { owner: null } ] },
// //       { $set: { owner: mongoose.Types.ObjectId(NEW_OWNER_ID) } }
// //     );
// //     console.log('Updated listings with missing owner:', res2.modifiedCount, 'modified');

// //     await mongoose.connection.close();
// //     console.log('Done — connections closed');
// //     process.exit(0);
// //   } catch (err) {
// //     console.error('Error:', err);
// //     try { await mongoose.connection.close(); } catch (e) {}
// //     process.exit(1);
// //   }
// // }

// // run();


const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const Listing = require('../models/listing.js');

const OLD_OWNER_ID = "68d04f78aceb8923db3e77cc"; 
const NEW_OWNER_ID = "68e40d22ea3c0ec01b6563b6"; 

async function main() {
  try {
    console.log("DB URL:", process.env.DB_URL);

    await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 30000
    });
    console.log('MongoDB Connected');

    const res = await Listing.updateMany(
      { owner: new mongoose.Types.ObjectId(OLD_OWNER_ID) },
      { $set: { owner: new mongoose.Types.ObjectId(NEW_OWNER_ID) } }
    );
    console.log('Listings updated:', res.modifiedCount);

    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error updating listings:', err);
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit(1);
  }
}

main();

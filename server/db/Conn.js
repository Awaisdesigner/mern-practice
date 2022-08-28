const mongoose = require("mongoose");       

const DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>console.log("Database connected successfully")).catch((error)=>console.log("Error" , error.message));




// const mongoose = require("mongoose");

// const connection = async () => {
// 	try {
// 		await mongoose.connect(process.env.DATABASE_URL);
// 		console.log("connected to database");
// 	} catch (e) {
// 		console.log(e);
// 	}
// };

// module.exports = connection;
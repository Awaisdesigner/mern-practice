const Products = require("./models/ProductsSchema");
const productsdata = require("./constant/ProductsData");


const DefaultData = async () => {
    try {

        await Products.deleteMany({})

        const storeData = await Products.insertMany(productsdata);
        console.log(storeData);
    } catch (error) {
        console.log("Error" + error.message);
    }
};


module.exports = DefaultData;
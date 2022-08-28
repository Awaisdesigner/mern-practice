const express = require("express");
const Router = new express.Router();
const Products = require("../models/ProductsSchema");
const USER = require("../models/UserSchema");
const bcrypt = require("bcryptjs");



// get productsdata api by get
Router.get("/getproducts", async (req, res) => {
    try {
        const productsdata = await Products.find();
        console.log("console the data", productsdata);
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});



// get individual data 
Router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const individualdata = await Products.findOne({ id });
        // console.log(individualdata + "individual data");

        res.status(201).json(individualdata);
        console.log(individualdata);

    } catch (error) {
        res.status(400).json(individualdata);
        console.log("error" + error.message);

    }
});



// register data api by post
Router.post("/register", async (req, res) => {
    // console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;
    if (!fname || !email || !mobile || !password || !cpassword) {
        return res.status(400).json({ error: "Plz fill all the fields 😢" });
    }

    // if(password.length < 8)
    // return 
    // const hashedPassword =  await bcrypt.hash(password, 10)

    try {
        const preuser = await USER.findOne({ email: email })
        if (preuser) {
            res.status(422).json({ error: "User Already Registered 😠" })
        }
        else if (password !== cpassword) {
            res.status(400).json({ error: "Password is not match 😢" })
        }
        else if (mobile.length > 11) {
            res.status(422).json({ error: "Mobile number limit exceed 😢" })

        }
        else if (mobile.length < 9) {
            res.status(422).json({ error: "Minimum number of mobile digits is 6 😢" })
        }
        else if (!email.includes('@')) {
            res.status(422).json({ error: "Email is invalid 👎" })

        }
        else {
            const finalUser = new USER({
                fname, email, mobile, password, cpassword
            });


            // encrypt -> siswjdo ->> decrypt -> saad 
            // bcryptjs 
            // pasword hashing process 


            const storedata = await finalUser.save();
            console.log(storedata);

            res.status(201).json(storedata);
        }

    }
    catch (error) {
        res.status(400).json({ error: "Invalid Details" })
    }

});



// login user api by post 
Router.post("/login", async (req, res) => {
    console.log('working')
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Plz fill all the fields 😢" })
    };

    try {
        const userlogin = await USER.findOne({ email });
        console.log(userlogin + "user value");

        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            console.log(isMatch);

            console.log(password);
            console.log(userlogin.password);


            // token generate
            const token = await userlogin.generateAuthtoken();
            console.log(token);


            // cookie generate 
            res.cookie("Amazonweb", token, {
                expires: new Date(Date.now() + 90000),
                httpOnly: true
            })




            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Details ...😢" })
            }
            else {
                res.status(200).json({ message: "Password is matched 😏" })
            }

        }
        else {
            res.status(400).json({ error: "Invalid Details ...😢" })

        }
    }
    catch (error) {
        res.status(400).json({ error: "Invalid Details" })
    }
    res.send("success")
})




// adding data to the cart 
Router.post("/addcart/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cart = Products.findOne({ id: id });
        console.log(cart + "cart value");
    }
    catch (error) {

    }
})



module.exports = Router;     
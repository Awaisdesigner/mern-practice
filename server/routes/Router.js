const express = require("express");
const Router = new express.Router();
const Products = require("../models/ProductsSchema");
const USER = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const Authenticate = require("../middleware/Authenticate");


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
Router.post("/addcart/:id", Authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");

        const userContact = await USER.findOne({ _id: req.userID })
        console.log(userContact);


        if (userContact) {
            const cartData = await userContact.addcartdata(cart);
            await userContact.save();
            console.log(cartData);
            res.status(201).json(userContact);
        }
        else {
            res.status(401).json({ error: "invalid user" });

        }

    }
    catch (error) {
        res.status(401).json({ error: "invalid user" });
    }
})



// update data in api 

Router.put("/", async (req, res) => {

    try {
        const { name, description, price, category, imageUrl } = req.body;
        console.log("NAME", name);
        // update only provided fields
        if (!name || !description || !price || !category || !imageUrl) {
            return res.status(400).json({
                status: "Status Failed",
                message: "Please fill all fields",
            });
        } else {
            const product = await Products.findById(req.params.id);
            if (!product) {
                return res.status(400).json({
                    status: "Status Failed",
                    message: "Product not found",
                });
            } else {
                product.id = id;
                product.url = url;
                product.price = price;
                product.category = category;
                product.imageUrl = imageUrl;
                await product.save();
                res.status(200).json({
                    status: "Status Success",
                    message: "Product updated",
                    product: product,
                });
            }
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: "Status Failed",
            message: "Server error",
        });
    }
})




module.exports = Router;     
require("dotenv").config();
const express = require("express");
const app = express();
require("./db/Conn");
const cookieParser = require("cookie-parser");


const cors = require("cors");
const router = require("./routes/Router");



app.use(express.json());
app.use(cookieParser(""));
app.use(cors({
    // origin: "http://localhost:3000"
}));
app.use(router);



const port = 4600;       


app.listen(port, () => {
    console.log(`server is running on port number ${port}`);
})
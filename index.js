/*import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;

// Get current directory name
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static("public"));

// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the homepage
app.get("/", (req, res) => {
  res.render("login", { response: "" });
});

//Render the signup.ejs file
app.get("/signup", (req, res) => {
  res.render(__dirname + "/views/signup.ejs");
});

app.get("/forgot_password",(req,res)=>{
  res.render(__dirname+"/views/forgot_password.ejs");
});

app.post("/login", async (req, res) => {
  const username = req.body.Username;
  const password = req.body.Password;
  if(username!='Admin@iitdh.ac.in'){
  try {
      db.query("SELECT * FROM users WHERE email=?", [username], function (err, result) {
          if (err) {
              console.error("Error: ", err);
          } else {
              if (result.length > 0) {
                  const pass = result[0].password;
                  name = result[0].fName;
                  email = result[0].email;
                  bcrypt.compare(password, pass, async (err, result) => {
                      if (err) {
                          console.error("Error: ", err);
                      } else {
                          if (result) {
                             

                              res.render(__dirname + "/views/upload.ejs", {
                                  Name: name,
                                  email: email,
                                  books: books,
                              });
                          } else {
                              res.render(__dirname + "/views/login.ejs", {
                                  response: "Invalid Credentials. Try Again.",
                              });
                          }
                      }
                  });
              } else {
                  res.render(__dirname + "/views/login.ejs", {
                      response: "User does not exist.",
                  });
              }
          }
      });
  } catch (err) {
      console.error("Error: ", err.message);
      res.redirect("/");
  }}
  else{
      try{
          db.query("SELECT * FROM users WHERE email='Admin@iitdh.ac.in'",function(err,result){
              if(err)
              console.error("Error: ",err);
              else{
                  const pass=result[0].password;
                  name = result[0].fName;
                  email = result[0].email;
                  bcrypt.compare(password, pass, (err, result) => {
                      if (err) {
                          console.error("Error: ", err);
                      } else {
                          if (result) {
                              res.render(__dirname + "/views/admin_open.ejs", {
                                  Name: name,
                                  email: email,
                                  books: books,
                              });
                          } else {
                              res.render(__dirname + "/views/login.ejs", {
                                  response: "Invalid Credentials. Try Again.",
                              });
                          }
                      }
                  });
              }
          });
      }
      catch(err){
      console.error("Error: ",err);}
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});*/

// import express from "express";
// import bodyParser from "body-parser";
// import bcrypt from "bcrypt"; // For password hashing and comparison
// import mongoose from "mongoose"; // MongoDB ODM
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// // Initialize express app
// const app = express();
// const port = 3000;

// // Get current directory name
// const __dirname = dirname(fileURLToPath(import.meta.url));

// // Set the view engine to EJS
// app.set("view engine", "ejs");

// // Serve static files from the public directory
// app.use(express.static("public"));

// // Parse incoming requests with urlencoded payloads
// app.use(bodyParser.urlencoded({ extended: true }));

// // Connect to MongoDB using Mongoose
// mongoose
//   .connect("mongodb+srv://cs23bt076:vZGQ7GgCopadMQRD@datafort.qka8h.mongodb.net/")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

// // Define User Schema and Model
// const userSchema = new mongoose.Schema({
//   fName: String,
//   lName: String,
//   email: { type: String, unique: true },
//   password: String,
// });

// const User = mongoose.model("User", userSchema);

// // Route for the homepage (login page)
// app.get("/", (req, res) => {
//   res.render("login", { response: "" });
// });

// // Render the signup page
// app.get("/signup", (req, res) => {
//   res.render(__dirname + "/views/signup.ejs");
// });

// // Render the forgot password page
// app.get("/forgot_password", (req, res) => {
//   res.render(__dirname + "/views/forgot_password.ejs");
// });

// // Helper function to handle login (Admin or Regular User)
// const handleLogin = (user, password, res, isAdmin) => {
//   const { fName, email } = user;
//   const page = isAdmin ? "admin_open" : "upload";

//   bcrypt.compare(password, user.password, (err, result) => {
//     if (err) {
//       console.error("Error comparing passwords:", err);
//       return res.render("login", { response: "Server error. Try again." });
//     }

//     if (result) {
//       res.render(__dirname + `/views/${page}.ejs`, {
//         Name: fName,
//         email: email,
//         books: [], // Replace with books fetched from DB if necessary
//       });
//     } else {
//       res.render("login", { response: "Invalid Credentials. Try Again." });
//     }
//   });
// };

// // Login Route
// app.post("/login", async (req, res) => {
//   const { Username, Password } = req.body;
//   const isAdmin = Username === "Admin@iitdh.ac.in";

//   try {
//     // Fetch user from the database
//     const user = await User.findOne({ email: Username });

//     if (!user) {
//       return res.render("login", { response: "User does not exist." });
//     }

//     // Handle login based on user type (Admin or Regular)
//     handleLogin(user, Password, res, isAdmin);
//   } catch (err) {
//     console.error("Error fetching user:", err.message);
//     res.render("login", { response: "Server error. Try again." });
//   }
// });
// app.post("/signup", async (req, res) => {
//   const { fName,lName, email, password } = req.body;

//   try {
//     // Hash the password before storing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save a new user
//     const newUser = new User({ fName,lName, email, password: hashedPassword });
//     await newUser.save();

//     res.redirect("/"); // Redirect to login after successful signup
//   } catch (err) {
//     console.error("Error during signup:", err.message);
//     res.render("signup", { response: "Signup failed. Try again." });
//   }
// });
// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt"; // For password hashing and comparison
import mongoose from "mongoose"; // MongoDB ODM
import { fileURLToPath } from "url";
import { dirname } from "path";
import nodemailer from "nodemailer";
import cron from "cron";

// Initialize express app
const app = express();
const port = 3000;
let code = 1000;
let user_email="";
let pubkey_arr=[];
let prikey_arr=[];
let use_name="";
// Get current directory name
const __dirname = dirname(fileURLToPath(import.meta.url));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static("public"));

// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb+srv://cs23bt076:vZGQ7GgCopadMQRD@datafort.qka8h.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err.message));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  privatekey: { type: [String], unique: true, required: true },
  publickey: {type: [String], unique: true, required: true },
});

const User = mongoose.model("User", userSchema);

// Route for the homepage (login page)
app.get("/", (req, res) => {
  res.render("login", { response: "" });
});

// Render the signup page
app.get("/signup", (req, res) => {
  res.render("signup", { response: "" }); // Make sure to send a response variable for errors
});

// Render the forgot password page
app.get("/forgot_password", (req, res) => {
  res.render("forgot_password");
});

app.get("/upload_file", (req, res) => {
  res.render("upload", { response: "" });
});

// Helper function to handle login (Admin or Regular User)
const handleLogin = (user, password, res, isAdmin) => {
  const { fName, email } = user;
  const page = isAdmin ? "admin_open" : "wallet";

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error("Error comparing passwords:", err);
      return res.render("login", { response: "Server error. Try again." });
    }

    if (result) {
      res.redirect(`${page}`);
    } else {
      res.render("login", { response: "Invalid Credentials. Try Again." });
    }
  });
};

// Login Route
app.post("/login", async (req, res) => {
  const { Username, Password } = req.body;
  const isAdmin = Username === "Admin@iitdh.ac.in";
  use_name=Username;
  try {
    // Fetch user from the database
    const user = await User.findOne({ username: Username });

    if (!user) {
      return res.render("login", { response: "User does not exist." });
    }

    // Handle login based on user type (Admin or Regular)
    handleLogin(user, Password, res, isAdmin);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.render("login", { response: "Server error. Try again." });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const username=req.body.name;
  const email=req.body.mail;
  const password=req.body.pswd;
  const prikey=req.body.prikey;
  const pubkey=req.body.pubkey;
  // Log the incoming request data
  console.log("Signup request body:", req.body);

  // Input validation
  if (!username || !prikey || !pubkey || !email || !password) {
    return res.render("signup", { response: "All fields are required." });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", { response: "Email already in use." });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    prikey_arr=[prikey]
    pubkey_arr=[pubkey]
    // Create and save a new user
    const newUser = new User({ username: username, password: hashedPassword, email: email, privatekey: prikey_arr, publickey: pubkey_arr });
    await newUser.save();
    res.redirect("/upload_file"); // Redirect to login after successful signup
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.render("signup", { response: "Signup failed. Try again." });
  }
});

app.post("/reset_password",async (req,res)=>{
  const r_email = req.body.email;
  try{
        const resobj = await User.findOne({email: r_email});
        const result=resobj.email;
        user_email=result;
    if(result.length > 0){
    code = Math.floor(Math.random()*10000);
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'thedominators4444@gmail.com',
            pass: 'mlja cufb bgtt zkiq'
        }
    });
    let mailOptions = {
        from: '"The DOMinators" <thedominators4444@gmail.com>',
        to: r_email,
        subject: "Reset Password",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <div style="display: flex; justify-content: center;">
                <img src="https://i.ibb.co/8m2PTDw/DF-logo.jpg" width="150px" alt="Logo">
                <h4 style="color: #89288f; font-size: xx-large;">&nbsp;Reset Password</h4>
            </div>
            <div style="text-align: center;">
                <p style="font-size: x-large;">Secret Code</p>
                <p style="font-size: x-large;">${code}</p>
            </div>
        </body>
        </html>`,
    };
    transporter.sendMail(mailOptions,(error, info)=>{
        if(error){
            return console.log(error);
        }
        res.render(__dirname+"/views/code.ejs");
    });}
    else{
        res.render(__dirname+"/views/forgot_password.ejs",{
            response: "User does not exist.",
        });
    }
  }
  catch(err){
    console.error("Error finding user:", err.message);
    res.render(__dirname+"/views/forgot_password.ejs",{
      response: "User does not exist.",
  });
  }
});

app.post("/code",(req,res)=>{
  const in_code=req.body.code;
  if(in_code==code && in_code>=0){
      res.sendFile(__dirname+"/views/reset.html");
  }
  else{
      res.render(__dirname+"/views/code.ejs",{
          response: "Incorrect Code",
      });
  }
});

app.post("/reset",async (req,res)=>{
    const new_pass = req.body.Password;
    try{
      const hash = await bcrypt.hash(new_pass, 10);

          // Update the password field
          const result1 = await User.updateOne(
            { email: user_email }, // Filter document by email
            { $set: { password: hash } } // Update operation
          );
          if (result1.modifiedCount > 0) {
            res.redirect("/");
          } else {
            res.status(400).send("Error updating password or user not found.");
          }

    }
    catch(err){
      console.error("Error: ", err);
      res.status(500).send("Server Error");
    }
});

app.get("/wallet",async (req,res)=>{
  try{
      const wallet = await User.findOne({username: use_name});
      const no_of_keys=wallet.privatekey.length;
      res.render("wallet",{wallets: no_of_keys});
  }
  catch(err){
    res.redirect("/");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

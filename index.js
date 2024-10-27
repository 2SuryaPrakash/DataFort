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
import Web3 from 'web3';
import cron from "cron";
import { create } from "ipfs-http-client";
import crypto from "crypto";
// Initialize express app
const app = express();
const port = 3000;
let code = 1000;
let user_email="";
let pubkey_arr=[];
let prikey_arr=[];
let use_name="";
let user_pass="";
let cids=[[]];
let fileLinks=[];
let walletId=0;
// Get current directory name
const __dirname = dirname(fileURLToPath(import.meta.url));
const web3=new Web3();
// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static("public"));
app.use(bodyParser.json());
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
  cids: {type: [[String]], unique: true}
});

const User = mongoose.model("User", userSchema);

// Route for the homepage (login page)
/*app.get("/", (req, res) => {
  res.render("login", { response: "" });
});*/

async function ipfsClient() {
  const ipfs = await create(
    {
      host:"http://10.240.255.119",
      port:5001,
      protocol:"https"
    }
  );
  return ipfs;
}
async function uploadToIpfs() {
  let ipfs = await ipfsClient();
  let result = await ipfs.add("Hello");
  return result;
}

async function getFile(cid) {
  let ipfs = ipfsClient();
  let asyncitr = ipfs.cat(cid);
  for await (const itr of asyncitr){
    let data=Buffer.from(itr).toString();
    console.log(data);
  }
}

app.get('/', (req, res) => {
  res.render('landing_page'); // Render the homepage EJS file
});

app.get("/login", (req, res) => {
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
  walletId=req.query.walletId;
  if(isNaN(walletId)){
    walletId=0;
  }
  console.log(parseInt(walletId));
  res.render("upload", { name: use_name, cids: cids, walletno: walletId });
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
      user_pass=password;
      res.redirect(`${page}`);
    } else {
      res.render("login", { response: "Invalid Credentials. Try Again." });
    }
  });
};

function createNewKey(){
  const keys=web3.eth.accounts.create();
  return keys;
}

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

app.post("/show_link", async (req,res)=>{
  try{
    fileLinks=[];
    const self_user=await User.findOne({username: use_name});
    const cid_arr=self_user.cids[walletId];
    for(const cid of cid_arr){
      const response=await fetch(`http://10.200.241.97:4000/api/file/${cid}`);
      if(!response.ok){
        throw new Error(`Failed to fetch link for ${cid}: ${response.statusText}`);
      }
      const contentType = response.headers.get('Content-Type');
      let fileExtension;
      switch (contentType) {
        case 'application/pdf':
            fileExtension = 'pdf';
            break;
        case 'image/jpeg':
            fileExtension = 'jpg';
            break;
        case 'image/png':
            fileExtension = 'png';
            break;
        case 'text/plain':
            fileExtension = 'txt';
            break;
        case 'application/octet-stream':
            fileExtension = 'bin'; // Generic binary file
            break;
        // Add more content types as needed
        default:
            fileExtension = 'file'; // Fallback
      }
      const fileUrl = `http://10.200.241.97:4000/api/file/${cid}`;
      fileLinks.push({ cid, filePath: fileUrl });
    }
    res.render("upload",{name: use_name,cids: cids, walletno: walletId, fileLinks: fileLinks});
  }
  catch(err){
    console.error('Error fetching file links:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const username=req.body.name;
  const email=req.body.mail;
  const password=req.body.pswd;
  const keys=createNewKey();
  const prikey=keys.privateKey;
  const pubkey=keys.address;
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
    prikey_arr=[prikey];
    pubkey_arr=[pubkey];
    // Create and save a new user
    const newUser = new User({ username: username, password: hashedPassword, email: email, privatekey: prikey_arr, publickey: pubkey_arr, cids: cids});
    await newUser.save();
    res.redirect("/login"); // Redirect to login after successful signup
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.render("signup", { response: "Signup failed. Try again." });
  }
});

async function encryptCID(cid){
  const iv = crypto.randomBytes(16);
  const sel_user=await User.findOne({username: use_name});
  const private_Key=sel_user.privatekey[walletId];
  const cipher = crypto.createCipheriv('aes-256-cbc',private_Key,iv);
  let encrypted = cipher.update(cid,'utf8','hex');
  encrypted+=cipher.final('hex');
  return{
    encryptedCID: encrypted,
    iv: iv.toString('hex')
  };
}

async function decryptCID(encryptCID,ivHex) {
  const ivBuffer = Buffer.from(ivHex,'hex');
  const sel_user=await User.findOne({username: use_name});
  const private_Key=sel_user.privatekey[walletId];
  const decipher = crypto.createDecipheriv('aes-256-cbc',private_Key,ivBuffer);
  let decrypted=decipher.update(encryptCID,'hex','utf8');
  return decrypted;
}
app.post("/api/upload-cid", async (req, res) => {
  let { cid } = req.body;
  console.log("CID received:", cid);

  if (!cid) {
      return res.status(400).send('CID is required');
  }

  try {
    cid = cid.toString();

    // Log and validate walletId
    const walletIndex = parseInt(walletId, 10); // Ensure walletId is an integer
    console.log("walletId:", walletId, "Parsed walletIndex:", walletIndex);

    const sel_user = await User.findOne({ username: use_name });

    if (!sel_user) {
        console.error(`User with username ${use_name} not found.`);
        return res.status(404).send('User not found');
    }

    // Ensure `cids` is initialized as a 2D array
    if (!Array.isArray(sel_user.cids)) {
        sel_user.cids = [];
    }

    // Initialize array at `walletIndex` if it doesn’t exist
    if (!Array.isArray(sel_user.cids[walletIndex])) {
        sel_user.cids[walletIndex] = [];
    }

    // Log cids structure before modification
    console.log("cids before push:", JSON.stringify(sel_user.cids));

    // Add the new CID
    sel_user.cids[walletIndex].push(cid);

    // Log cids structure after modification
    console.log("cids after push:", JSON.stringify(sel_user.cids));

    // Save the updated user document
    const savedUser = await sel_user.save();

    if (savedUser) {
        console.log(`CID ${cid} added successfully to user ${use_name} under walletId ${walletIndex}`);
        res.status(200).send('CID uploaded and saved successfully');
    } else {
        console.error("Failed to save user after CID update.");
        res.status(500).send('Failed to save CID to database');
    }
  } catch (error) {
      console.error('Error saving CID to database:', error);
      res.status(500).send('Internal server error');
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

app.post("/add",async (req,res)=>{
  const keys=createNewKey();
  const prikey=keys.privateKey;
  const pubkey=keys.address;
  const user=await User.findOne({username: use_name});
  user.privatekey.push(prikey);
  user.publickey.push(pubkey);
  await user.save();
  res.redirect("/profile");
});

app.get("/wallet",async (req,res)=>{
  try{
      const wallet = await User.findOne({username: use_name});
      const no_of_keys=wallet.privatekey.length;
      if(no_of_keys>1){
        res.render("wallet",{wallets: no_of_keys});
      }
      else{
        res.redirect('/upload_file');
      }
  }
  catch(err){
    res.redirect("/");
  }
});

app.get("/profile",async (req,res)=>{
  const wallets1=await User.findOne({username: use_name}); 
  user_email=wallets1.email;
  res.render("profile",{
    name: use_name,
    email: user_email,
    wallet: wallets1.publickey.length,
    pubkey: wallets1.publickey,
    prikey: wallets1.privatekey,
    user_pass: user_pass,
  });
})

app.get('/get-private-key/:walletId', async (req, res) => {
  const walletId = parseInt(req.params.walletId);
  const user = await User.findOne({ username: use_name });

  if (user && user.privatekey[walletId - 1]) {
    res.json({ success: true, privateKey: user.privatekey[walletId - 1] });
  } else {
    res.json({ success: false, message: 'Wallet not found' });
  }
});

app.get("/logout",async (req,res)=>{
  use_name="";
  user_email="";
  user_pass="";
  pubkey_arr=[];
  prikey_arr=[];
  cids=[];
  walletId=0;
  fileLinks=[];
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
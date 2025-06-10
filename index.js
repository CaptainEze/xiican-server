import "dotenv/config"
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { ethers } from "ethers";
import tokenJson from './artifacts/contracts/Token.sol/Token.json' with { type: 'json' };
import { login, loginScreen, register, registerScreen } from "./controllers/authControllers.js";
import dbConn from "./db/conn.js";
import { AuthMiddleware } from "./middlewares/authMiddleware.js";
import { dashboard } from "./controllers/appControllers.js";


const app = express();

app.disable("x-powered-by");
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));



app.get("/", loginScreen);
app.get("/cnc/ys", registerScreen);
app.post("/", login);
app.post("/cnc/ys", register);


app.get("/dashboard",AuthMiddleware, dashboard);


app.post("/auth", async (req, res) => {
  const { pin } = req.body;
  
  if (pin == process.env.ACCESS_PIN) {
    const uaHash = bcrypt.hash(req.headers["user-agent"], 10);
    const token = jwt.sign({ uaHash }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("auth", token, { httpOnly: true });
    console.log("here")
    return res.redirect("/dashboard");
  }
  return res.redirect("/");
});

// app.get("/dashboard", authMiddleware, (req, res) => {
//   res.render('dashboard', {
//     message: req.query.message || null,
//     error: req.query.error || null
//   });
// });

// app.post("/deploy", authMiddleware, async (req, res) => {
//   const { name, symbol, decimals } = req.body;
//   const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//   const factory = new ethers.ContractFactory(
//     tokenJson.abi,
//     tokenJson.bytecode,
//     wallet
//   );
//   try {
//     const contract = await factory.deploy(name, symbol, decimals, 1000000);
//     await contract.waitForDeployment();
//     return res.send(`Token deployed at ${contract.target}`);
//   } catch (e) {
//     return res.send("Deployment failed: " + e.message);
//   }
// });

// app.post("/deploy", authMiddleware, async (req, res) => {
//   const { name, symbol, decimals } = req.body;
//   // Deploy token logic (simplified)
//   const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//   const factory = new ethers.ContractFactory(
//     tokenJson.abi,
//     tokenJson.bytecode,
//     wallet
//   );
//   try {
//     const contract = await factory.deploy(name, symbol, 10000);
//     await contract.waitForDeployment();
//     return res.send(`Token deployed at ${contract.target}`);
//   } catch (e) {
//     return res.send("Deployment failed: " + e.message);
//   }
// });

// app.post("/deploy", authMiddleware, async (req, res) => {
//   const { name, symbol, decimals } = req.body;
//   const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//   const factory = new ethers.ContractFactory(
//     tokenJson.abi,
//     tokenJson.bytecode,
//     wallet
//   );

//   try {
//     // Use a fixed decimals or convert decimals input to number
//     const decimalsNum = parseInt(decimals, 10) || 9;
//     const initialSupply = 1_000_000; // Or customize as needed

//     const contract = await factory.deploy(name, symbol, decimalsNum, initialSupply);
//     await contract.waitForDeployment();

//     return res.send(`Token deployed at ${contract.target}`);
//   } catch (e) {
//     return res.send("Deployment failed: " + e.message);
//   }
// });



// app.post("/send", authMiddleware, async (req, res) => {
//   const { tokenAddress, to, amount } = req.body;
//   const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

//   const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
//   const token = new ethers.Contract(tokenAddress, abi, wallet);

//   try {
//     const tx = await token.transfer(to, ethers.parseUnits(amount.toString(), 9));
//     await tx.wait();
//     return res.send(`Sent ${amount} tokens to ${to}`);
//   } catch (err) {
//     return res.send("Send failed: " + err.message);
//   }
// });

app.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});



const PORT = process.env.PORT || 5200;

dbConn()
app.listen(PORT, ()=>{
    console.log("Listening on port", PORT)
})
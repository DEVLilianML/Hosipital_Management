const express = require("express");
const bcrypt = require("bcrypt");
const collection = require("./congfig"); // Correct the import path to 'congfig'

const app = express();

// Convert data to JSON format
app.use(express.json());

// Indicating static files
app.use(express.static("public"));

// URL Encoding
app.use(express.urlencoded({ extended: false }));

// EJS
app.set("view engine", "ejs");

// Render
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

app.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        // Check if the email already exists in the database
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.send('User already exists. Please choose a different email.');
        } 

        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new collection({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword // Store the hashed password in confirmPassword for now
        });

        await newUser.save();
        console.log(newUser);
        res.send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ email: req.body.email });
        if (!user) {
            return res.send("Email not found");
        }

        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.send("Wrong Password");
        }

        res.render("dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Port number  
const port = 4400;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
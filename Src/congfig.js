const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Dform", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((error) => {
        console.log("Database cannot be Connected", error);
    });

// Create Schema
const signupSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    }
});

// Create Collection
const User = mongoose.model("user", signupSchema);

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Handle signup form submissions
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    });
   
    newUser.save()
        .then(() => {
            res.send("User registered successfully");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = User;
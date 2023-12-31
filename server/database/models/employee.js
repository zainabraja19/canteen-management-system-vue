const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
require("dotenv").config();

const employeeSchema = mongoose.Schema({
    empId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error("Please enter a valid email!");
            }
        },
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    role: {
        type: String,
        enum: ["employee", "admin"],
        default: "employee",
    },
    profilePicture: {
        buffer: { type: Buffer },
        extension: { type: String },
        mimeType: { type: String },
    },
    resume: {
        buffer: { type: Buffer },
        extension: { type: String },
        mimeType: { type: String },
        originalName: { type: String },
    },
});

// Handle signup errors
employeeSchema.statics.handleError = (error) => {
    let errors = null;

    // Handle duplicate key error
    if (error.name === "MongoServerError" && error.code === 11000) {
        const key = Object.keys(error.keyPattern)[0];
        errors = `${key} already exists`;
    }

    // Handle validation error
    if (error.name === "ValidationError" && error.errors) {
        Object.keys(error.errors).map((key) => {
            errors = error.error.message;
        });
    }

    return errors;
};

// Find/verify user for login
employeeSchema.statics.findByCredentials = async (email, password) => {
    // try {
    const emp = await Employee.findOne(
        { email },
        { profilePicture: 0, resume: 0, __v: 0 }
    );
    if (!emp) {
        throw new Error("Incorrect username or password. Please try again!");
    }

    const isMatch = await bcrypt.compare(password, emp.password);
    if (!isMatch) {
        throw new Error("Incorrect username or password. Please try again!");
    }

    return emp;
};

// Hash the plain text password before saving and add default user profile
employeeSchema.pre("save", async function (next) {
    const emp = this;
    const hash = await bcrypt.hash(emp.password, 10);

    this.password = hash;

    const data = await fetch(
        "https://assets.stickpng.com/thumbs/585e4beacb11b227491c3399.png"
    );
    const defaultPictureBuffer = Buffer.from(
        await data.arrayBuffer(),
        "base64"
    );

    this.profilePicture.buffer = defaultPictureBuffer;
    this.profilePicture.extension = "png";
    this.profilePicture.mimeType = "image/png";

    next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;

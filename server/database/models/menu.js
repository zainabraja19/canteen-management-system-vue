const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const menuSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 1000,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    itemImage: {
        buffer: { type: Buffer },
        extension: { type: String },
        mimeType: { type: String },
    },
    // onlyForToday: {
    //     type: Boolean,
    //     // required: true
    // }
});

menuSchema.pre("save", async function (next) {
    const imagePath = path.join(__dirname, "../../public/food_logo.jpg");

    try {
        // Read the image file as a buffer
        const data = fs.readFileSync(imagePath);
        const defaultPictureBuffer = Buffer.from(data);

        // Set properties for the image
        this.itemImage.buffer = defaultPictureBuffer;
        this.itemImage.extension = "jpg";
        this.itemImage.mimeType = "image/jpg";

        next();
    } catch (error) {
        throw new Error(`Error reading file: ${error}`);
    }
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;

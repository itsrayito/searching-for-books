const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// import schema from Book.js
const bookSchema = require("./Book");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, "Must use a valid email address"],
        },
        password: {
            type: String,
            required: true,
        },

        // This is going to set savedBooks to be an array of data that is with the bookSchema
        savedBooks: [bookSchema],
    },

    // this is going to use virtual below
    {
        toJSON: {
            virtuals: true,
        },
    }
);

// this will hash the user password
userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

// a custom method to compare and validate the password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// query a user, we would also get another field called 'bookCount' with the number of saved books 
userSchema.virtual("bookCount").get(function () {
    return this.savedBooks.length;
});

const User = model("User", userSchema);

module.exports = User;

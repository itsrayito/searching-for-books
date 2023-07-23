const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
    authMiddleware: function ({ req }) {

        // this is going to allow the token to be sent via req.body, req.query, or headers
            let token = req.body.token || req.query.token || req.headers.authorization;

        // tokenvalue
        if (req.headers.authorization) {
            token = token.split(" ").pop().trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            reportError.user = data;
        } catch {
            console.log("Invalid token");
        }

        return req;
    },
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
};


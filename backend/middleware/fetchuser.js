var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Priyanshuisgo$d';

const fetchuser = (req, res, next) => {
    // Get the user and add id to req

    // extracting the token from header and name it auth-token(use in content-type)
    // header(thunder client header) contains the auth-token
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        // verifying the token and jwt secret
        const data = jwt.verify(token, JWT_SECRET);
        // sending the response
        req.user = data.user;
        // if executed then execute the next function
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate" })
    }

}

module.exports = fetchuser;
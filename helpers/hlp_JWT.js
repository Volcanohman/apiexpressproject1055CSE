const jwt = require("jsonwebtoken");

authenticateToken = function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next()
    });
}

generateAccessToken = function(user) {
    return jwt.sign({email: user.email}, process.env.TOKEN_SECRET, { expiresIn: 60*60 });
}

module.exports = {
    authenticateToken, generateAccessToken
}
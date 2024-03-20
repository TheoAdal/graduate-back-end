const jwt = require('jsonwebtoken');
const SECRET_KEY = "32a73325382c067ba3d4835ec262ade45df8ff6bd46505037138005af94ec8f9";// Store this securely!
const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h'
    });
};
const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};
module.exports = { generateToken, verifyToken };
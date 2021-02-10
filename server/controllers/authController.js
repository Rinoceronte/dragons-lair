const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    let {username, password, isAdmin} = req.body;
    // console.log(typeof password);
    let db = req.app.get('db');
    const result = await db.get_user([username]);
    const existingUser = result[0];
    if(existingUser) { 
        return res.status(409).send('Username taken');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.register_user([isAdmin, username, hash]);
    const user = registeredUser[0];
    req.session.user = {isAdmin: user.is_admin, username: user.username, id: user.id};
    return res.status(201).send(req.session.user);
}

const login = async (req, res, next) => {
    let {username, password} = req.body;
    let db = req.app.get('db');
    const result = await db.get_user([username]);
    const user = result[0];
    if(!user){
        return res.status(401).send('User not found. Please register as a new user before logging in.');
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if(!isAuthenticated) {
        return res.status(403).send('Incorrect password.');
    }
    req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username};
    return res.status(201).send(req.session.user);
}

const logout = (req, res, next) => {
    req.session.destroy();
    return res.sendStatus(200);
}

module.exports = {
    register,
    login,
    logout,
};
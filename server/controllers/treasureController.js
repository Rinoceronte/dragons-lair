
const dragonTreasure = async (req, res, next) => {
    const db = req.app.get('db');
    const treasure = await db.get_dragon_treasure(1);
    return res.status(200).send(treasure);
}

const getUserTreasure = async (req, res, next) => {
    const db = req.app.get('db');
    const treasure = await db.get_user_treasure([req.session.user.id]);
    return res.status(200).send(treasure);
}

const addUserTreasure = async (req, res, next) => {
    const {treasureUrl} = req.body;
    const {id} = req.session.user;
    const db = req.app.get('db');

    const userTreasure = await db.add_user_treasure([treasureUrl, id]);
    return res.status(200).send(userTreasure);
}

const getAllTreasure = async (req, res, next) => {
    const allTreasure = await req.app.get('db').get_all_treasure();
    return res.status(200).send(allTreasure);
}

module.exports = {
    dragonTreasure,
    getUserTreasure,
    addUserTreasure,
    getAllTreasure,
};
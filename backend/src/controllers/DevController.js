const axios = require('axios');
const Dev = require('../models/Dev');
const paseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },
    async store(req, res) {
        const { github_username, techs, latidude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = response.data;

            const techsArray = paseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latidude],
            };

            let dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            return res.json(dev);
        } else {
            return res.json({ message: 'usuario ja cadastrado' });
        }
    }
};
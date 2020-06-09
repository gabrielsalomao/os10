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
    },
    async show(request, response) {
        const dev = await Dev.findById(request.params.id)

        return response.json(dev);
    },
    async update(request, response) {

        const { techs, ...devBody } = request.body;

        const techsArray = paseStringAsArray(techs);

        devBody.techs = techsArray;

        const dev = await Dev.findByIdAndUpdate(request.params.id, devBody, { new: true });

        return response.json(dev);
    },
    async destroy(request, response) {
        const dev = await Dev.findByIdAndRemove(request.params.id);
        console.log(dev);
        return response.send({ message: 'excluido com sucesso' });
    },
};
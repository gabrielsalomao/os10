const Dev = require('../models/Dev');
const paseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        // Buscar todos devs num raio de 10km
        // Filtrar por tecnologias

        const { latitude, longitude, techs } = request.query;

        const techsArray = paseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return response.json({ devs });
    }
}
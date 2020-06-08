const { Router } = require('express');
const axios = require('axios');

const routes = Router();

routes.get('/devs', (req, res) => {
    return res.json({ message: 'Hello Omnissdstack' });
});

routes.post('/devs', async (req, res) => {
    const { github_username } = req.body;

    const response = await axios.get(`https://api.github.com/users/${github_username}`);

    const { name = login, avatar_url, bio } = response.data;

    console.log(name, avatar_url, github_username);

    return res.json(response.data);
});

module.exports = routes;
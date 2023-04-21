const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');


router.route('/')
    .get(statesController.getAllStates)
    //.post(statesController.createFunFact)
    //.patch(statesController.updateFunFact)
    //.delete(statesController.deleteFunFact);

    router.route('/:state')
    .get(statesController.getState);

module.exports = router;
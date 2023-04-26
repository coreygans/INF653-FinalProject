const StatesDB = require('../model/States');
const path = require('path');
const data = {
    statesData: require('../model/statesData.json'),
    setState: function (data) {this.states = data}
};

//TODO: Need to add funfacts to this endpoint
const getAllStates = (req, res) => {
    res.status(200).json(data.statesData);
}


const getState = async (req,res) => {
    const state = data.statesData.find(state => state.code == req.params.state.toUpperCase());
    if (!state) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter" });
    }
    state.funfacts = [];
    const funfact = await StatesDB.findOne({stateCode: req.params.state.toUpperCase()}, 'funfacts').lean();
    if(funfact){
        state.funfacts = state.funfacts.concat(funfact.funfacts);
    }
    res.status(200).json(state);

}

const getStateInfo = async (req, res) => {
    const state = data.statesData.find(state => state.code == req.params.state.toUpperCase());
    const info = req.params.info;
    const funfact = await StatesDB.findOne({stateCode: req.params.state.toUpperCase()}, 'funfacts').lean();
    if (!state) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter" });
    }
    switch (info) {
        case 'capital':
            return res.status(200).json({'state': state.state, 'capital':state.capital_city});
            break;
        case 'nickname':
            return res.status(200).json({'state': state.state, 'nickname':state.nickname});
            break;
        case 'population':
            return res.status(200).json({'state': state.state, 'population':state.population.toLocaleString("en-US")});
            break;
        case 'admission':
            return res.status(200).json({'state': state.state, 'admitted':state.admission_date});
            break;
        case 'funfact':
            if(funfact) {
                const rand = Math.floor(Math.random() * funfact.funfacts.length);
                return res.status(200).json({'funfact':funfact.funfacts[rand]});
            }
            else {
                return res.status(404).json({ 'message': 'No Fun Facts found for ' + state.state }); 
            }
        default:
            res.status(404);
            if(req.accepts('html')) {
                res.sendFile(path.join(__dirname,'..','views', '404.html'));
            }

    }

}

module.exports = {
    getAllStates,
    getState,
    getStateInfo
}
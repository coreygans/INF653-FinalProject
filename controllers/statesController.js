const StatesDB = require('../model/States');
const data = {
    statesData: require('../model/statesData.json'),
    setState: function (data) {this.states = data}
};


const getAllStates = (req, res) => {
    res.status(200).json(data.statesData);
}


const getState = async (req,res) => {
    const state = data.statesData.find(state => state.code == req.params.state);
    if (!state) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter" });
    }
    state.funfacts = [];
    const funfact = await StatesDB.findOne({stateCode: req.params.state}, 'funfacts').lean();
    state.funfacts = state.funfacts.concat(funfact.funfacts);
    res.status(200).json(state);

}


module.exports = {
    getAllStates,
    getState
}
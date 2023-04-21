//const States = require('../model/States');
const data = {
    statesData: require('../model/statesData.json'),
    setState: function (data) {this.states = data}
};


const getAllStates = (req, res) => {
    res.json(data.statesData);
}


const getState = (req,res) => {
    const state = data.statesData.find(state => state.code == req.params.state);
    if (!state) {
        return res.status(400).json({ "message": `State Code ${req.params.state} not found` });
    }
    res.json(state);

}

module.exports = {
    getAllStates,
    getState
}
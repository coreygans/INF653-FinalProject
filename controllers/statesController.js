//const States = require('../model/States');
const data = {
    statesData: require('../model/statesData.json'),
    setState: function (data) {this.states = data}
};


const getAllStates = (req, res) => {
    res.status(200).json(data.statesData);
}


const getState = (req,res) => {
    const state = data.statesData.find(state => state.code == req.params.state);
    if (!state) {
        return res.status(404).json({ "message": `State Code ${req.params.state} not found` });
    }
    res.status(200).json(state);

}

module.exports = {
    getAllStates,
    getState
}
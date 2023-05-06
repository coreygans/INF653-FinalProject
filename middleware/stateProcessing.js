const data = {
    statesData: require('../model/statesData.json'),
    setState: function (data) {this.states = data}
};
const allStateCodes = () => {
    const state = data.statesData;
    const stateMap = state.map(state => state.code);
    return stateMap;
}
const nonContig = ['AK','HI'];

const contigStates = () => {
    const allStates = allStateCodes();
    const contigResults = allStates.filter(state => !nonContig.includes(state));
    return contigResults;
}

module.exports = {
    allStateCodes,
    nonContig,
    contigStates
}
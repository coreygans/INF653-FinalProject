const StatesDB = require('../model/States');
const path = require('path');
const data = {
    statesData: require('../model/statesData.json'),
    setState: function (data) {this.states = data}
};
const stateProcessing = require('../middleware/stateProcessing');
const { stat } = require('fs');

//TODO Need to add funfacts to this endpoint
//    data.statesData.forEach(state => ) add the funfacts for each state by looking up the funfact for the state and then appending
const getAllStates = (req, res) => {
    const state = data.statesData;
    res.status(200).json(state);
}


const getState = async (req,res) => {
    const statesData = data.statesData.find(state => state.code == req.params.state.toUpperCase());
    if (!statesData) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter" });
    }
    const funfact = await StatesDB.findOne({stateCode: req.params.state.toUpperCase()}, 'funfacts').lean();
    if(funfact){
        statesData.funfacts = [];
        statesData.funfacts = statesData.funfacts.concat(funfact.funfacts);
    }
    res.status(200).json(statesData);

}

const getStateInfo = async (req, res) => {
    const statesData = data.statesData.find(state => state.code == req.params.state.toUpperCase());
    const info = req.params.info;
    const funfact = await StatesDB.findOne({stateCode: req.params.state.toUpperCase()}, 'funfacts').lean();
    if (!statesData) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter" });
    }
    switch (info) {
        case 'capital':
            return res.status(200).json({'state': statesData.state, 'capital':state.capital_city});
            break;
        case 'nickname':
            return res.status(200).json({'state': statesData.state, 'nickname':state.nickname});
            break;
        case 'population':
            return res.status(200).json({'state': statesData.state, 'population':statesData.population.toLocaleString("en-US")});
            break;
        case 'admission':
            return res.status(200).json({'state': statesData.state, 'admitted':statesData.admission_date});
            break;
        case 'funfact':
            if(funfact) {
                const rand = Math.floor(Math.random() * funfact.funfacts.length);
                return res.status(200).json({'funfact':funfact.funfacts[rand]});
            }
            else {
                return res.status(404).json({ 'message': 'No Fun Facts found for ' + statesData.state }); 
            }
        default:
            res.status(404);
            if(req.accepts('html')) {
                res.sendFile(path.join(__dirname,'..','views', '404.html'));
            }

    }

}



//TODO: Also need to get the state logic down (verify if I need this or not)
const createFunFact = async (req, res) => { 
    const state = req.params.state.toUpperCase();
    const stateExist = await StatesDB.findOne({stateCode: state}, 'funfacts').lean();
    const funfacts = req.body.funfacts;
 //   if (!allStateCodes.includes(state)) {
  //      return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
  //   }

    try {
        if(!funfacts){
            return res.status(404).json({ 'message': 'State fun facts value required' }); 
        }
        if(!Array.isArray(funfacts)){
            return res.status(404).json({ 'message': 'State fun facts value must be an array' }); 
        }
        else if(!stateExist){
        const result = await StatesDB.create({
            stateCode: state,
            funfacts: funfacts
        });
        res.status(201).json(result);
        }

        else{
        const allFunFacts = stateExist.funfacts.concat(req.body.funfacts);
        const funfact = await StatesDB.findOneAndUpdate({stateCode: state}, {'funfacts': allFunFacts}, {new: true});
        res.status(201).json(funfact);
        }
    } catch (err) {
        console.error(err);
    }
}

//TODO Need to check the state array and see if the state code exists. If it isn't a valid state, throw an error
const updateFunFact = async (req,res) => {
    const statesData = data.statesData.find(state => state.code == req.params.state.toUpperCase());
    const state = req.params.state.toUpperCase();
    const stateExist = await StatesDB.findOne({stateCode: state}, 'funfacts').lean();
    const index = req.body.index;
    const funfact = req.body.funfacts;
    
    try {
        if(!stateExist) {
            return res.status(404).json({ 'message': 'No Fun Facts found for ' + statesData.state }); 
        }
        else if(!index) {
            console.log(index);
            return res.status(404).json({ 'message': 'State fun fact index value required' }); 
        }
        else if(!funfact){
            return res.status(404).json({ 'message': 'State fun facts value required' }); 
        }
        else if(index > stateExist.funfacts.length){
            return res.status(404).json({ 'message': 'No Fun Fact found at that index for ' + statesData.state }); 
        }
        else {
            const allFunFacts = stateExist.funfacts;       
            const updatedFunfacts = allFunFacts.map((fact,i)=> i === (index-1) ? funfact : fact); 
            const newFunfacts = await StatesDB.findOneAndUpdate({stateCode: state}, {'funfacts': updatedFunfacts}, {new: true});
            res.status(201).json(newFunfacts);
            }
    }
    catch (err) {
    
        console.error(err);
    }

 
        
}      
const deleteFunFact = async (req,res) => {       
    const statesData = data.statesData.find(state => state.code == req.params.state.toUpperCase()); 
    const state = req.params.state.toUpperCase();
    const stateExist = await StatesDB.findOne({stateCode: state}, 'funfacts').lean();
    const index = req.body.index;
    
    try {
        if(!stateExist) {
            return res.status(404).json({ 'message': 'No Fun Facts found for ' + statesData.state }); 
        }
        else if(!index) {
            console.log(index);
            return res.status(404).json({ 'message': 'State fun fact index value required' }); 
        }
        else {
            const allFunFacts = stateExist.funfacts;       
            const updatedFunfacts = allFunFacts.filter((fact,i)=> i !== (index-1)); 
            const newFunfacts = await StatesDB.findOneAndUpdate({stateCode: state}, {'funfacts': updatedFunfacts}, {new: true});
            res.status(201).json(newFunfacts);
            }
    }
    catch (err) {
    
        console.error(err);
    }

}

module.exports = {
    getAllStates,
    getState,
    getStateInfo,
    createFunFact,
    updateFunFact,
    deleteFunFact
}
const StatesDB = require('../model/States');
const path = require('path');
const data = {
    statesData: require('../model/statesData.json'),
    setState: function (data) {this.states = data}
};
const stateProcessing = require('../middleware/stateProcessing');
const { stat } = require('fs');

//Need to add funfacts to this endpoint
//    data.statesData.forEach(state => ) add the funfacts for each state by looking up the funfact for the state and then appending

const getAllStates = (req, res) => {
    const state = data.statesData;
    res.status(200).json(state);
}


const getState = async (req,res) => {
    const state = data.statesData.find(state => state.code == req.params.state.toUpperCase());
    if (!state) {
        return res.status(404).json({ "message": "Invalid state abbreviation parameter" });
    }
    const funfact = await StatesDB.findOne({stateCode: req.params.state.toUpperCase()}, 'funfacts').lean();
    if(funfact){
        state.funfacts = [];
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



//TODO: Need to get POST working to append if it exists. Also need to get the state logic down (verify if I need this or not)
const createFunFact = async (req, res) => { 
    const state = req.params.state.toUpperCase();
    const stateExist = await StatesDB.findOne({stateCode: state}, 'funfacts').lean();
 //   if (!allStateCodes.includes(state)) {
  //      return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
  //   }

    try {
        if(!stateExist){
        const result = await StatesDB.create({
            stateCode: state,
            funfacts: req.body.funfacts
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

const updateFunFact = async (req,res) => {
    const state = req.params.state.toUpperCase();
    const stateExist = await StatesDB.findOne({stateCode: state}, 'funfacts').lean();
    const index = req.body.index;
    const funfact = req.body.funfacts;
    
    try {
        if(!stateExist) {
            return res.status(404).json({ 'message': 'No Fun Facts found for ' + state.state }); 
        }
        else if(!index) {
            console.log(index);
            return res.status(404).json({ 'message': 'State fun fact index value required' }); 
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
    const state = req.params.state.toUpperCase();
    const stateExist = await StatesDB.findOne({stateCode: state}, 'funfacts').lean();
    const index = req.body.index;
    
    try {
        if(!stateExist) {
            return res.status(404).json({ 'message': 'No Fun Facts found for ' + state.state }); 
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
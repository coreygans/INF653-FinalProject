
//Cross Origin Resource Sharing
const approvedlist = ['https://inf653-final-project-coreyg.glitch.me', 'http://localhost:3500'];
const corsOptions = {

    origin: (origin, callback) => {
        if(approvedlist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error('Not allowed by Cors'));
        }
    },
    optionsSuccessStatus:200
}

module.exports = corsOptions;
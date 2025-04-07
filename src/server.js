const app = require("./app");
const {default: mongoose} = require("mongoose");
const dotenv = require("dotenv");


//* Load ENV
const productionMode = process.env.NODE_ENV == 'production'
if (!productionMode) {
    dotenv.config();
}

//* Starting Server
function startServer() {
    const port = +process.env.PORT
    app.listen(port, () => {
        console.log(
            `server running in ${
            productionMode ? 'production' : 'development'
            } mode on port ${port}
            `);

    });
};

//* DataBase Connection
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongoDB connected on ${mongoose.connection.host}`);
        
    } catch (err) {
        console.error(`Error in DataBase connection -> `, err);
        process.exit(1);
    }
};



async function run() {
    startServer()
    await connectToDB()
};

run();
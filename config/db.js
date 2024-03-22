const { MongoClient } = require("mongodb");
const boom = require('@hapi/boom');

// Reference about this:
// https://www.mongodb.com/docs/drivers/node/current/quick-start/connect-to-mongodb/
// https://www.mongodb.com/languages/javascript/mongodb-and-npm-tutorial
// Replace the uri string with your connection string.
//const uri = "<connection string uri>";

//const client = new MongoClient(uri);
let _uri;

const setUri = (uri) => _uri = uri;
const getUri = () => _uri;

const connectDB = async (uri) => {
    try{
        const client = new MongoClient(uri,  {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await client.connect();

        return client;
    }catch(err){
        throw boom.internal("Cannot establish a connection with the database.");
    }
};

const execute = async(collName, query) => {
    let conn;
    let result;

    try {
        conn = await connectDB(getUri());
        const coll = conn.db().collection(collName);
        result = await query(coll);
    } finally {
        await conn.close();
    }

    return result;
}

module.exports = { connectDB, setUri, getUri, execute };

/*async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/
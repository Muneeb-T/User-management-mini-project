const mongoClient = require("mongodb").MongoClient;
let state = { db: null };
module.exports = {
       connect: (done) => {
              const url = "mongodb://localhost:27017";
              const database = "ReaderHub";
              mongoClient.connect(url, (err, data) => {
                     if (!err) {
                            state.db = data.db(database);
                            done();
                     } else {
                            done(err);
                     }
              });
       },
       get: () => state.db,
};



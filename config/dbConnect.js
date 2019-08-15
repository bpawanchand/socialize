const MongoClient = require(‘mongodb’).MongoClient;
const uri = "mongodb+srv://pawanchand@gmail.com:Mdnib@06@cluster0-4ixdo.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

module.exports = client;
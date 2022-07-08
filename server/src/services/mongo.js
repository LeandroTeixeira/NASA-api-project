const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGO_PASSWORD}@cluster0.euwpkrd.mongodb.net/nasa?retryWrites=true&w=majority`;

mongoose.connection.once('open', () => {
  console.log('MongoDB Connection Ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };

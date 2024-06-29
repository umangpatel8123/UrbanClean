import {MongoClient} from 'mongodb';

const mongo = new MongoClient(`${process.env['MONGO_URI']}`);
const mongoClient = await mongo.connect();

export default function getMongoClient(): MongoClient {
  return mongoClient;
}

import {ObjectId} from 'mongodb';

import getMongoClient from '../lib/mongoClient.js';

const mongoClient = getMongoClient();

export default class TicketMessage {
  public _id: ObjectId;
  public createdAt: Date;
  public message: string;
  public ticketId: ObjectId;
  public userId: ObjectId;

  constructor(
    ticketMsg: {
      message: string;
      ticketId: ObjectId;
      userId: ObjectId;
    },
    _id = new ObjectId()
  ) {
    this._id = _id;
    this.ticketId = ticketMsg.ticketId;
    this.message = ticketMsg.message;
    this.userId = ticketMsg.userId;
    this.createdAt = new Date();
  }

  static async findByTicketId(ticketId: string) {
    return mongoClient
      .db()
      .collection('ticketMessages')
      .find({ticketId: new ObjectId(ticketId)})
      .toArray();
  }

  async save() {
    return mongoClient
      .db()
      .collection('ticketMessages')
      .insertOne(this.toJSON());
  }

  public toJSON() {
    return {
      _id: this._id,
      createdAt: this.createdAt,
      message: this.message,
      ticketId: this.ticketId,
      userId: this.userId,
    };
  }
}

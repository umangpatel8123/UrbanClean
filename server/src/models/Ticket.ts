import {Filter, FindOptions, ObjectId, UpdateFilter} from 'mongodb';

import getMongoClient from '../lib/mongoClient.js';

const mongoClient = getMongoClient();

export default class Ticket {
  public _id: ObjectId;
  public closed: boolean;
  public createdAt: Date;
  public title: string;
  public updatedAt: Date;
  public userId: ObjectId;

  constructor(
    ticket: {
      closed?: boolean;
      title: string;
      updatedAt?: Date;
      userId: ObjectId;
    },
    _id = new ObjectId()
  ) {
    this._id = _id;
    this.userId = ticket.userId;
    this.title = ticket.title;
    this.createdAt = new Date();
    this.updatedAt = ticket.updatedAt ?? new Date();
    this.closed = ticket.closed ?? false;
  }

  static async find(
    filter: Filter<Ticket> = {},
    options: FindOptions<Ticket> = {}
  ) {
    return mongoClient
      .db()
      .collection<Ticket>('tickets')
      .find(filter, options)
      .toArray();
  }

  static async findById(_id: string) {
    return mongoClient
      .db()
      .collection<Ticket>('tickets')
      .findOne({_id: new ObjectId(_id)});
  }

  static async findWithAllUser(filter: Filter<Ticket> = {}) {
    return mongoClient
      .db()
      .collection<Ticket>('tickets')
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            as: 'user',
            foreignField: '_id',
            from: 'users',
            localField: 'userId',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 1,
            closed: 1,
            createdAt: 1,
            title: 1,
            updatedAt: 1,
            user: {
              name: 1,
            },
            userId: 1,
          },
        },
      ])
      .toArray();
  }

  static async updateOne(filter: Filter<Ticket>, update: UpdateFilter<Ticket>) {
    return mongoClient
      .db()
      .collection<Ticket>('tickets')
      .updateOne(filter, update);
  }

  async save() {
    return mongoClient.db().collection('tickets').insertOne(this.toJSON());
  }

  public toJSON() {
    return {
      _id: this._id,
      closed: this.closed,
      createdAt: this.createdAt,
      title: this.title,
      updatedAt: this.updatedAt,
      userId: this.userId,
    };
  }
}

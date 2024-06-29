import {Filter, FindOptions, ObjectId, UpdateFilter} from 'mongodb';

import getMongoClient from '../lib/mongoClient.js';

const mongoClient = getMongoClient();

export enum GarbageCollectorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  WORKING = 'working',
}

export default class GarbageCollector {
  public _id: ObjectId;
  public createdAt: Date;
  public deleted: boolean;
  public lat: number;
  public long: number;
  public status: GarbageCollectorStatus;
  public updatedAt: Date;

  constructor(
    garbageCollector: {
      createdAt?: Date;
      deleted?: boolean;
      lat: number;
      long: number;
      status?: GarbageCollectorStatus;
      updatedAt?: Date;
    },
    _id = new ObjectId()
  ) {
    this._id = _id;
    this.createdAt = garbageCollector.createdAt ?? new Date();
    this.deleted = garbageCollector.deleted ?? false;
    this.updatedAt = garbageCollector.updatedAt ?? new Date();
    this.status = garbageCollector.status ?? GarbageCollectorStatus.INACTIVE;
    this.lat = garbageCollector.lat;
    this.long = garbageCollector.long;
  }

  static async countDocuments(query: Filter<GarbageCollector> = {}) {
    return mongoClient
      .db()
      .collection<GarbageCollector>('garbageCollectors')
      .countDocuments(query);
  }

  static async find(
    query: Filter<GarbageCollector> = {},
    options: FindOptions<GarbageCollector> = {}
  ) {
    return mongoClient
      .db()
      .collection<GarbageCollector>('garbageCollectors')
      .find(query, options)
      .toArray();
  }

  static async findById(
    _id: ObjectId | string,
    options: FindOptions<GarbageCollector> = {}
  ) {
    return mongoClient
      .db()
      .collection<GarbageCollector>('garbageCollectors')
      .findOne({_id: new ObjectId(_id)}, options);
  }

  static async findOne(
    garbageCollector: Filter<GarbageCollector>,
    options: FindOptions<GarbageCollector> = {}
  ) {
    return mongoClient
      .db()
      .collection<GarbageCollector>('garbageCollectors')
      .findOne(garbageCollector, options);
  }

  static async updateById(
    _id: ObjectId | string,
    update: UpdateFilter<GarbageCollector>,
    returnUpdated = false
  ) {
    if (returnUpdated) {
      return mongoClient
        .db()
        .collection<GarbageCollector>('garbageCollectors')
        .findOneAndUpdate({_id: new ObjectId(_id)}, update, {
          returnDocument: 'after',
        });
    }
    return mongoClient
      .db()
      .collection<GarbageCollector>('garbageCollectors')
      .updateOne({_id: new ObjectId(_id)}, update);
  }

  static async updateOne(
    garbageCollector: Filter<GarbageCollector>,
    update: UpdateFilter<GarbageCollector>,
    returnUpdated = false
  ) {
    if (returnUpdated) {
      return mongoClient
        .db()
        .collection<GarbageCollector>('garbageCollectors')
        .findOneAndUpdate(garbageCollector, update, {
          returnDocument: 'after',
        });
    }
    return mongoClient
      .db()
      .collection<GarbageCollector>('garbageCollectors')
      .updateOne(garbageCollector, update);
  }

  async save() {
    return mongoClient
      .db()
      .collection('garbageCollectors')
      .insertOne(this.toJSON());
  }

  public toJSON() {
    return {
      _id: this._id,
      createdAt: this.createdAt,
      deleted: this.deleted,
      lat: this.lat,
      long: this.long,
      status: this.status,
      updatedAt: this.updatedAt,
    };
  }
}

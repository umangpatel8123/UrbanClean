import {Filter, FindOptions, ObjectId, UpdateFilter} from 'mongodb';

import getMongoClient from '../lib/mongoClient.js';

const mongoClient = getMongoClient();

export enum UserRole {
  ADMIN = 'ADMIN',
  COLLECTOR = 'COLLECTOR',
  USER = 'USER',
}

export enum UserAccountProvider {
  EMAIL = 'EMAIL',
}

export default class User {
  public _id: ObjectId;
  public collector: ObjectId | null;
  public createdAt: Date;
  public deleted: boolean;
  public email: string;
  public name: string;
  public password: string;
  public provider: UserAccountProvider;
  public role: UserRole;
  public updatedAt: Date;
  public verified: boolean;

  constructor(
    user: {
      collector?: ObjectId;
      createdAt?: Date;
      deleted?: boolean;
      email: string;
      name: string;
      password: string;
      provider?: UserAccountProvider;
      role?: UserRole;
      updatedAt?: Date;
      verified?: boolean;
    },
    _id = new ObjectId()
  ) {
    this._id = _id;
    this.createdAt = user.createdAt ?? new Date();
    this.deleted = user.deleted ?? false;
    this.email = user.email;
    this.name = user.name;
    this.password = user.password;
    this.provider = user.provider ?? UserAccountProvider.EMAIL;
    this.role = user.role ?? UserRole.USER;
    this.updatedAt = user.updatedAt ?? new Date();
    this.verified = user.verified ?? false;
    this.collector = user.collector ?? null;
  }

  static async countDocuments(query: Filter<User> = {}) {
    return mongoClient.db().collection<User>('users').countDocuments(query);
  }

  static async find(query: Filter<User> = {}, options: FindOptions<User> = {}) {
    return mongoClient
      .db()
      .collection<User>('users')
      .find(query, options)
      .toArray();
  }

  static async findByEmail(
    email: string,
    filter: Filter<User> = {},
    options: FindOptions<User> = {}
  ) {
    return mongoClient
      .db()
      .collection<User>('users')
      .findOne({email, ...filter}, options);
  }

  static async findById(
    _id: ObjectId | string,
    options: FindOptions<User> = {}
  ) {
    return mongoClient
      .db()
      .collection<User>('users')
      .findOne({_id: new ObjectId(_id)}, options);
  }

  static async findOne(user: Filter<User>, options: FindOptions<User> = {}) {
    return mongoClient.db().collection<User>('users').findOne(user, options);
  }

  static async updateById(
    _id: ObjectId | string,
    update: UpdateFilter<User>,
    returnUpdated = false
  ) {
    if (returnUpdated) {
      return mongoClient
        .db()
        .collection<User>('users')
        .findOneAndUpdate({_id: new ObjectId(_id)}, update, {
          returnDocument: 'after',
        });
    }
    return mongoClient
      .db()
      .collection<User>('users')
      .updateOne({_id: new ObjectId(_id)}, update);
  }

  static async updateOne(
    user: Filter<User>,
    update: UpdateFilter<User>,
    returnUpdated = false
  ) {
    if (returnUpdated) {
      return mongoClient
        .db()
        .collection<User>('users')
        .findOneAndUpdate(user, update, {
          returnDocument: 'after',
        });
    }
    return mongoClient.db().collection<User>('users').updateOne(user, update);
  }

  async save() {
    return mongoClient.db().collection('users').insertOne(this.toJSON());
  }

  public toJSON() {
    return {
      _id: this._id,
      collector: this.collector,
      createdAt: this.createdAt,
      deleted: this.deleted,
      email: this.email,
      name: this.name,
      password: this.password,
      provider: this.provider,
      role: this.role,
      updatedAt: this.updatedAt,
      verified: this.verified,
    };
  }
}

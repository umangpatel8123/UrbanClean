import {Filter, FindOptions, ObjectId, UpdateFilter} from 'mongodb';
import {randomUUID} from 'node:crypto';

import getMongoClient from '../lib/mongoClient.js';

const mongoClient = getMongoClient();

export default class VerificationCode {
  public _id: ObjectId;
  public code: string;
  public createdAt: Date;
  public deleted: boolean;
  public expiresAt: Date;
  public updatedAt: Date;
  public used: boolean;
  public usedAt?: Date;
  public user: ObjectId;

  constructor(
    verificationCode: {
      createdAt?: Date;
      deleted?: boolean;
      expiresAt?: Date;
      updatedAt?: Date;
      used?: boolean;
      usedAt?: Date;
      user: ObjectId;
    },
    code = randomUUID(),
    _id = new ObjectId()
  ) {
    this._id = _id;
    this.code = code;
    this.user = new ObjectId(verificationCode.user);
    this.createdAt = verificationCode.createdAt ?? new Date();
    this.updatedAt = verificationCode.updatedAt ?? new Date();
    if (!verificationCode.expiresAt) {
      this.expiresAt = new Date();
      this.expiresAt.setTime(this.expiresAt.getTime() + 86400000);
    } else {
      this.expiresAt = verificationCode.expiresAt;
    }
    this.usedAt = verificationCode.usedAt;
    this.used = verificationCode.used ?? false;
    this.deleted = verificationCode.deleted ?? false;
  }

  static async find(
    verificationCode: Filter<VerificationCode>,
    options: FindOptions<VerificationCode> = {}
  ) {
    return mongoClient
      .db()
      .collection<VerificationCode>('verificationCodes')
      .findOne(verificationCode, options);
  }

  static async findByCode(
    code: string,
    options: FindOptions<VerificationCode> = {}
  ) {
    return mongoClient
      .db()
      .collection<VerificationCode>('verificationCodes')
      .findOne({code}, options);
  }

  static async findById(
    _id: ObjectId | string,
    options: FindOptions<VerificationCode> = {}
  ) {
    return mongoClient
      .db()
      .collection<VerificationCode>('verificationCodes')
      .findOne({_id: new ObjectId(_id)}, options);
  }

  static async updateOne(
    verificationCode: Filter<VerificationCode>,
    update: UpdateFilter<VerificationCode>
  ) {
    return mongoClient
      .db()
      .collection<VerificationCode>('verificationCodes')
      .updateOne(verificationCode, update);
  }

  async save() {
    return mongoClient
      .db()
      .collection('verificationCodes')
      .insertOne(this.toJSON());
  }

  public toJSON() {
    return {
      _id: this._id,
      code: this.code,
      createdAt: this.createdAt,
      deleted: this.deleted,
      updatedAt: this.updatedAt,
      used: this.used,
      usedAt: this.usedAt,
      user: this.user,
    };
  }
}

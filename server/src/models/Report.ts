import {Filter, FindOptions, ObjectId, UpdateFilter} from 'mongodb';

import getMongoClient from '../lib/mongoClient.js';

const mongoClient = getMongoClient();

export enum ReportStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  REJECTED = 'rejected',
  WORKING = 'working',
}

export enum ReportType {
  BULKY = 'bulky',
  DRY = 'dry',
  HAZARDOUS = 'hazardous',
  NORMAL = 'normal',
  WET = 'wet',
}

export default class Report {
  public _id: ObjectId;
  public createdAt: Date;
  public deleted: boolean;
  public description: string;
  public images: string[];
  public lat: number;
  public long: number;
  public status: ReportStatus;
  public type: ReportType;
  public updatedAt: Date;
  public user: ObjectId;

  constructor(
    report: {
      createdAt?: Date;
      deleted?: boolean;
      description: string;
      images?: string[];
      lat: number;
      long: number;
      status?: ReportStatus;
      type?: ReportType;
      updatedAt?: Date;
      user: ObjectId;
    },
    _id = new ObjectId()
  ) {
    this._id = _id;
    this.createdAt = report.createdAt ?? new Date();
    this.deleted = report.deleted ?? false;
    this.updatedAt = report.updatedAt ?? new Date();
    this.status = report.status ?? ReportStatus.PENDING;
    this.lat = report.lat;
    this.long = report.long;
    this.description = report.description;
    this.images = report.images ?? [];
    this.user = report.user;
    this.type = report.type ?? ReportType.NORMAL;
  }

  static async countDocuments(query: Filter<Report> = {}) {
    return mongoClient.db().collection<Report>('reports').countDocuments(query);
  }

  static async find(
    query: Filter<Report> = {},
    options: FindOptions<Report> = {}
  ) {
    return mongoClient
      .db()
      .collection<Report>('reports')
      .find(query, options)
      .toArray();
  }

  static async findById(
    _id: ObjectId | string,
    options: FindOptions<Report> = {}
  ) {
    return mongoClient
      .db()
      .collection<Report>('reports')
      .findOne({_id: new ObjectId(_id)}, options);
  }

  static async findOne(
    report: Filter<Report>,
    options: FindOptions<Report> = {}
  ) {
    return mongoClient
      .db()
      .collection<Report>('reports')
      .findOne(report, options);
  }

  static async updateById(
    _id: ObjectId | string,
    update: UpdateFilter<Report>,
    returnUpdated = false
  ) {
    if (returnUpdated) {
      return mongoClient
        .db()
        .collection<Report>('reports')
        .findOneAndUpdate({_id: new ObjectId(_id)}, update, {
          returnDocument: 'after',
        });
    }
    return mongoClient
      .db()
      .collection<Report>('reports')
      .updateOne({_id: new ObjectId(_id)}, update);
  }

  static async updateOne(
    report: Filter<Report>,
    update: UpdateFilter<Report>,
    returnUpdated = false
  ) {
    if (returnUpdated) {
      return mongoClient
        .db()
        .collection<Report>('reports')
        .findOneAndUpdate(report, update, {
          returnDocument: 'after',
        });
    }
    return mongoClient
      .db()
      .collection<Report>('reports')
      .updateOne(report, update);
  }

  async save() {
    return mongoClient.db().collection('reports').insertOne(this.toJSON());
  }

  public toJSON() {
    return {
      _id: this._id,
      createdAt: this.createdAt,
      deleted: this.deleted,
      description: this.description,
      images: this.images,
      lat: this.lat,
      long: this.long,
      status: this.status,
      type: this.type,
      updatedAt: this.updatedAt,
      user: this.user,
    };
  }
}

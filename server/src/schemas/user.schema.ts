import {Static, Type} from '@sinclair/typebox';

import {UserAccountProvider, UserRole} from '../models/User.js';
import {CollectorData} from './collector.schema.js';
import {ObjectIdString, UUIDString} from './generics.schema.js';

export const UserLoginBody = Type.Required(
  Type.Object({
    email: Type.String(),
    password: Type.String({
      maxLength: 128,
      minLength: 8,
    }),
  })
);

export type UserLoginBodyType = Static<typeof UserLoginBody>;

export const UserSignupBody = Type.Required(
  Type.Object({
    email: Type.String(),
    name: Type.String(),
    password: Type.String({
      maxLength: 128,
      minLength: 8,
    }),
  })
);

export type UserSignupBodyType = Static<typeof UserSignupBody>;

export const CollectorSignupBody = Type.Intersect([
  UserSignupBody,
  Type.Object({
    lat: Type.Number(),
    long: Type.Number(),
  }),
]);

export type CollectorSignupBodyType = Static<typeof CollectorSignupBody>;

export const UserData = Type.Object({
  _id: ObjectIdString,
  collector: Type.Optional(ObjectIdString),
  createdAt: Type.String(),
  deleted: Type.Boolean(),
  email: Type.String(),
  name: Type.String(),
  provider: Type.Enum(UserAccountProvider),
  role: Type.Enum(UserRole),
  updatedAt: Type.String(),
  verified: Type.Boolean(),
});

export type UserDataType = Static<typeof UserData>;

export const UserDataWithCollector = Type.Object({
  _id: ObjectIdString,
  collector: CollectorData,
  createdAt: Type.String(),
  deleted: Type.Boolean(),
  email: Type.String(),
  name: Type.String(),
  provider: Type.Enum(UserAccountProvider),
  role: Type.Enum(UserRole),
  updatedAt: Type.String(),
  verified: Type.Boolean(),
});

export type UserDataWithCollectorType = Static<typeof UserDataWithCollector>;

export const UserResponseBody = Type.Required(
  Type.Object({
    data: UserData,
    success: Type.Boolean(),
  })
);

export type UserResponseBodyType = Static<typeof UserResponseBody>;

export const UserBasicInfo = Type.Required(
  Type.Object({
    _id: ObjectIdString,
    email: Type.String(),
    name: Type.String(),
  })
);

export type UserBasicInfoType = Static<typeof UserBasicInfo>;

export const UserBasicInfoResponseBody = Type.Required(
  Type.Object({data: UserBasicInfo, success: Type.Boolean()})
);

export const UserVerifyParams = Type.Required(
  Type.Object({
    code: UUIDString,
  })
);

export type UserVerifyParamsType = Static<typeof UserVerifyParams>;

export const UserVerifyBody = Type.Required(
  Type.Object({
    password: Type.String({
      maxLength: 128,
      minLength: 8,
    }),
  })
);

export type UserVerifyBodyType = Static<typeof UserVerifyBody>;

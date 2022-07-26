// package: protoLibrary
// file: chat.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Chatroom extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  clearUsersList(): void;
  getUsersList(): Array<User>;
  setUsersList(value: Array<User>): void;
  addUsers(value?: User, index?: number): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Chatroom.AsObject;
  static toObject(includeInstance: boolean, msg: Chatroom): Chatroom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Chatroom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Chatroom;
  static deserializeBinaryFromReader(message: Chatroom, reader: jspb.BinaryReader): Chatroom;
}

export namespace Chatroom {
  export type AsObject = {
    id: number,
    usersList: Array<User.AsObject>,
  }
}

export class User extends jspb.Message {
  getUserid(): number;
  setUserid(value: number): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    userid: number,
    name: string,
  }
}

export class UserArray extends jspb.Message {
  clearUsersList(): void;
  getUsersList(): Array<User>;
  setUsersList(value: Array<User>): void;
  addUsers(value?: User, index?: number): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserArray.AsObject;
  static toObject(includeInstance: boolean, msg: UserArray): UserArray.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserArray, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserArray;
  static deserializeBinaryFromReader(message: UserArray, reader: jspb.BinaryReader): UserArray;
}

export namespace UserArray {
  export type AsObject = {
    usersList: Array<User.AsObject>,
  }
}

export class Message extends jspb.Message {
  getChatroomid(): number;
  setChatroomid(value: number): void;

  getMessageid(): number;
  setMessageid(value: number): void;

  hasUser(): boolean;
  clearUser(): void;
  getUser(): User | undefined;
  setUser(value?: User): void;

  getMessage(): string;
  setMessage(value: string): void;

  hasSendtime(): boolean;
  clearSendtime(): void;
  getSendtime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setSendtime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    chatroomid: number,
    messageid: number,
    user?: User.AsObject,
    message: string,
    sendtime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class Response extends jspb.Message {
  getMsg(): string;
  setMsg(value: string): void;

  getError(): number;
  setError(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    msg: string,
    error: number,
  }
}


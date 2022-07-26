// package: protoLibrary
// file: chat.proto

import * as chat_pb from "./chat_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ChatServiceJoinChatroom = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof chat_pb.Chatroom;
  readonly responseType: typeof chat_pb.Message;
};

type ChatServiceSendMessage = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: true;
  readonly responseStream: false;
  readonly requestType: typeof chat_pb.Message;
  readonly responseType: typeof chat_pb.Response;
};

type ChatServiceInviteToChatroom = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof chat_pb.User;
  readonly responseType: typeof chat_pb.Response;
};

type ChatServiceListUsers = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof chat_pb.Chatroom;
  readonly responseType: typeof chat_pb.UserArray;
};

type ChatServiceLeave = {
  readonly methodName: string;
  readonly service: typeof ChatService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof chat_pb.User;
  readonly responseType: typeof chat_pb.Response;
};

export class ChatService {
  static readonly serviceName: string;
  static readonly JoinChatroom: ChatServiceJoinChatroom;
  static readonly SendMessage: ChatServiceSendMessage;
  static readonly InviteToChatroom: ChatServiceInviteToChatroom;
  static readonly ListUsers: ChatServiceListUsers;
  static readonly Leave: ChatServiceLeave;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class ChatServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  joinChatroom(requestMessage: chat_pb.Chatroom, metadata?: grpc.Metadata): ResponseStream<chat_pb.Message>;
  sendMessage(metadata?: grpc.Metadata): RequestStream<chat_pb.Message>;
  inviteToChatroom(
    requestMessage: chat_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: chat_pb.Response|null) => void
  ): UnaryResponse;
  inviteToChatroom(
    requestMessage: chat_pb.User,
    callback: (error: ServiceError|null, responseMessage: chat_pb.Response|null) => void
  ): UnaryResponse;
  listUsers(
    requestMessage: chat_pb.Chatroom,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: chat_pb.UserArray|null) => void
  ): UnaryResponse;
  listUsers(
    requestMessage: chat_pb.Chatroom,
    callback: (error: ServiceError|null, responseMessage: chat_pb.UserArray|null) => void
  ): UnaryResponse;
  leave(
    requestMessage: chat_pb.User,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: chat_pb.Response|null) => void
  ): UnaryResponse;
  leave(
    requestMessage: chat_pb.User,
    callback: (error: ServiceError|null, responseMessage: chat_pb.Response|null) => void
  ): UnaryResponse;
}


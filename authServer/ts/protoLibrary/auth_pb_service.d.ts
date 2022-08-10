// package: protoLibrary
// file: auth.proto

import * as auth_pb from "./auth_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AuthServiceRegister = {
  readonly methodName: string;
  readonly service: typeof AuthService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof auth_pb.RegisterRequest;
  readonly responseType: typeof auth_pb.RegisterResponse;
};

type AuthServiceLogin = {
  readonly methodName: string;
  readonly service: typeof AuthService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof auth_pb.LoginRequest;
  readonly responseType: typeof auth_pb.LoginResponse;
};

type AuthServiceValidate = {
  readonly methodName: string;
  readonly service: typeof AuthService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof auth_pb.ValidateRequest;
  readonly responseType: typeof auth_pb.ValidateResponse;
};

export class AuthService {
  static readonly serviceName: string;
  static readonly Register: AuthServiceRegister;
  static readonly Login: AuthServiceLogin;
  static readonly Validate: AuthServiceValidate;
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

export class AuthServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  register(
    requestMessage: auth_pb.RegisterRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: auth_pb.RegisterResponse|null) => void
  ): UnaryResponse;
  register(
    requestMessage: auth_pb.RegisterRequest,
    callback: (error: ServiceError|null, responseMessage: auth_pb.RegisterResponse|null) => void
  ): UnaryResponse;
  login(
    requestMessage: auth_pb.LoginRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: auth_pb.LoginResponse|null) => void
  ): UnaryResponse;
  login(
    requestMessage: auth_pb.LoginRequest,
    callback: (error: ServiceError|null, responseMessage: auth_pb.LoginResponse|null) => void
  ): UnaryResponse;
  validate(
    requestMessage: auth_pb.ValidateRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: auth_pb.ValidateResponse|null) => void
  ): UnaryResponse;
  validate(
    requestMessage: auth_pb.ValidateRequest,
    callback: (error: ServiceError|null, responseMessage: auth_pb.ValidateResponse|null) => void
  ): UnaryResponse;
}


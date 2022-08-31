/**
 * @fileoverview gRPC-Web generated client stub for protoLibrary
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as auth_pb from './auth_pb';


export class AuthServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorRegister = new grpcWeb.MethodDescriptor(
    '/protoLibrary.AuthService/Register',
    grpcWeb.MethodType.UNARY,
    auth_pb.RegisterRequest,
    auth_pb.RegisterResponse,
    (request: auth_pb.RegisterRequest) => {
      return request.serializeBinary();
    },
    auth_pb.RegisterResponse.deserializeBinary
  );

  register(
    request: auth_pb.RegisterRequest,
    metadata: grpcWeb.Metadata | null): Promise<auth_pb.RegisterResponse>;

  register(
    request: auth_pb.RegisterRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.RegisterResponse) => void): grpcWeb.ClientReadableStream<auth_pb.RegisterResponse>;

  register(
    request: auth_pb.RegisterRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: auth_pb.RegisterResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/protoLibrary.AuthService/Register',
        request,
        metadata || {},
        this.methodDescriptorRegister,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/protoLibrary.AuthService/Register',
    request,
    metadata || {},
    this.methodDescriptorRegister);
  }

  methodDescriptorLogin = new grpcWeb.MethodDescriptor(
    '/protoLibrary.AuthService/Login',
    grpcWeb.MethodType.UNARY,
    auth_pb.LoginRequest,
    auth_pb.LoginResponse,
    (request: auth_pb.LoginRequest) => {
      return request.serializeBinary();
    },
    auth_pb.LoginResponse.deserializeBinary
  );

  login(
    request: auth_pb.LoginRequest,
    metadata: grpcWeb.Metadata | null): Promise<auth_pb.LoginResponse>;

  login(
    request: auth_pb.LoginRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.LoginResponse) => void): grpcWeb.ClientReadableStream<auth_pb.LoginResponse>;

  login(
    request: auth_pb.LoginRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: auth_pb.LoginResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/protoLibrary.AuthService/Login',
        request,
        metadata || {},
        this.methodDescriptorLogin,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/protoLibrary.AuthService/Login',
    request,
    metadata || {},
    this.methodDescriptorLogin);
  }

  methodDescriptorValidate = new grpcWeb.MethodDescriptor(
    '/protoLibrary.AuthService/Validate',
    grpcWeb.MethodType.UNARY,
    auth_pb.ValidateRequest,
    auth_pb.ValidateResponse,
    (request: auth_pb.ValidateRequest) => {
      return request.serializeBinary();
    },
    auth_pb.ValidateResponse.deserializeBinary
  );

  validate(
    request: auth_pb.ValidateRequest,
    metadata: grpcWeb.Metadata | null): Promise<auth_pb.ValidateResponse>;

  validate(
    request: auth_pb.ValidateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: auth_pb.ValidateResponse) => void): grpcWeb.ClientReadableStream<auth_pb.ValidateResponse>;

  validate(
    request: auth_pb.ValidateRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: auth_pb.ValidateResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/protoLibrary.AuthService/Validate',
        request,
        metadata || {},
        this.methodDescriptorValidate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/protoLibrary.AuthService/Validate',
    request,
    metadata || {},
    this.methodDescriptorValidate);
  }

}


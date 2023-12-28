// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var images_pb = require('./images_pb.js');

function serialize_images_ListImagesRequest(arg) {
  if (!(arg instanceof images_pb.ListImagesRequest)) {
    throw new Error('Expected argument of type images.ListImagesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_images_ListImagesRequest(buffer_arg) {
  return images_pb.ListImagesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_images_ListImagesResponse(arg) {
  if (!(arg instanceof images_pb.ListImagesResponse)) {
    throw new Error('Expected argument of type images.ListImagesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_images_ListImagesResponse(buffer_arg) {
  return images_pb.ListImagesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ImageServiceService = exports.ImageServiceService = {
  listImages: {
    path: '/images.ImageService/ListImages',
    requestStream: false,
    responseStream: false,
    requestType: images_pb.ListImagesRequest,
    responseType: images_pb.ListImagesResponse,
    requestSerialize: serialize_images_ListImagesRequest,
    requestDeserialize: deserialize_images_ListImagesRequest,
    responseSerialize: serialize_images_ListImagesResponse,
    responseDeserialize: deserialize_images_ListImagesResponse,
  },
};

exports.ImageServiceClient = grpc.makeGenericClientConstructor(ImageServiceService);

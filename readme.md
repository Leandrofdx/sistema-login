grpcurl -plaintext -import-path ./proto -proto images.proto -d '{}' localhost:50051 images.ImageService/ListImages

npx grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./ --grpc_out=./ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` images.proto
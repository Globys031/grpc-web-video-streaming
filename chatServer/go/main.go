package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"

	library "grpc-web-video-streaming/chatServer/go/protoLibrary"

	chat "grpc-web-video-streaming/chatServer/go/chat"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

var (
	enableTls       = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
	tlsCertFilePath = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
	tlsKeyFilePath  = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
)

func allowedOriginCors(origin string) bool {
	allowedOrigins := []string{
		"http://localhost:8080",
		"https://localhost:8080",
		"http://127.0.0.1:8080",
	}
	for _, allowedOrigin := range allowedOrigins {
		if allowedOrigin == origin {
			return true
		}
	}
	return false
}

func main() {
	flag.Parse()

	port := 9090
	if *enableTls {
		port = 9091
	}

	grpcServer := grpc.NewServer()

	library.RegisterChatServiceServer(grpcServer, &chat.ChatService{
		GlobalChatroomID: 0,
		// buffered array of channels mapped to int keyword
		ChanArr: make(map[int32][]chan *library.Message, 10),
		Mutex:   sync.Mutex{},
	})

	// library.RegisterChatServiceServer(grpcServer, &ChatService{
	// 	UnimplementedChatServiceServer: library.UnimplementedChatServiceServer{},
	// 	GlobalChatroomID:               0,
	// 	// buffered array of channels mapped to int keyword
	// 	ChanArr: make(map[int32][]chan *library.Message, 10),
	// 	Mutex:   sync.Mutex{},
	// })
	grpclog.SetLogger(log.New(os.Stdout, "chatserver: ", log.LstdFlags))

	wrappedServer := grpcweb.WrapServer(grpcServer, grpcweb.WithOriginFunc(allowedOriginCors))
	handler := func(resp http.ResponseWriter, req *http.Request) {
		wrappedServer.ServeHTTP(resp, req)
	}

	httpServer := &http.Server{
		Addr:    fmt.Sprintf("127.0.0.1:%d", port),
		Handler: http.HandlerFunc(handler),
	}

	grpclog.Printf("Starting chat server. http port: %d, with TLS: %v", port, *enableTls)

	if *enableTls {
		if err := httpServer.ListenAndServeTLS(*tlsCertFilePath, *tlsKeyFilePath); err != nil {
			grpclog.Fatalf("failed starting http2 chat server: %v", err)
		}
	} else {
		if err := httpServer.ListenAndServe(); err != nil {
			grpclog.Fatalf("failed starting http chat server: %v", err)
		}
	}
}

package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
	// "github.com/Globys031/grpc-web-video-streaming/gatewayServer/config"
	// "github.com/Globys031/grpc-web-video-streaming"
	// "github.com/Globys031/grpc-web-video-streaming"
	// "github.com/Globys031/grpc-web-video-streaming"
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
	library.RegisterBookServiceServer(grpcServer, &bookService{})
	grpclog.SetLogger(log.New(os.Stdout, "exampleserver: ", log.LstdFlags))

	wrappedServer := grpcweb.WrapServer(grpcServer, grpcweb.WithOriginFunc(allowedOriginCors))
	handler := func(resp http.ResponseWriter, req *http.Request) {
		wrappedServer.ServeHTTP(resp, req)
	}

	httpServer := &http.Server{
		Addr:    fmt.Sprintf("127.0.0.1:%d", port),
		Handler: http.HandlerFunc(handler),
	}

	grpclog.Printf("Starting server. http port: %d, with TLS: %v", port, *enableTls)

	if *enableTls {
		if err := httpServer.ListenAndServeTLS(*tlsCertFilePath, *tlsKeyFilePath); err != nil {
			grpclog.Fatalf("failed starting http2 server: %v", err)
		}
	} else {
		if err := httpServer.ListenAndServe(); err != nil {
			grpclog.Fatalf("failed starting http server: %v", err)
		}
	}
}

// func main() {
// 	c, err := config.LoadConfig()

// 	if err != nil {
// 		log.Fatalln("Failed at config", err)
// 	}

// 	// r := gin.Default()

// 	authSvc := *auth.RegisterRoutes(r, &c)
// 	product.RegisterRoutes(r, &c, &authSvc)
// 	order.RegisterRoutes(r, &c, &authSvc)

// 	r.Run(c.Port)
// }

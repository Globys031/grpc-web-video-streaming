package auth

import (
	"net/http"

	"golang.org/x/net/context"
	// "google.golang.org/grpc"
	// "google.golang.org/grpc/grpclog"

	library "grpc-web-video-streaming/authServer/go/protoLibrary"
)

type LoginRequestBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(ctx context.Context, client library.AuthServiceClient) {
	body := LoginRequestBody{}

	// Sita dalis tiesiog transponuoja json i regular data. Tai easy turetu but pakeist
	// Nemanau kad isvis json kazkoki transponavima reikes daryt. Vapsie ciuju peradarysiu pats
	// sita dali
	if err := ctx.BindJSON(&body); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	res, err := client.Login(context.Background(), &library.LoginRequest{
		Email:    body.Email,
		Password: body.Password,
	})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusCreated, &res)
}

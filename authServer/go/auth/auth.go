package auth

import (
	"context"
	"net/http"

	"github.com/Globys031/grpc-web-video-streaming/authServer/go/db"
	"github.com/Globys031/grpc-web-video-streaming/authServer/go/models"

	library "github.com/Globys031/grpc-web-video-streaming/authServer/go/protoLibrary"
	"github.com/Globys031/grpc-web-video-streaming/authServer/go/utils"
)

// TO DO:
// Add grpc errors every where the code is checking for errors. For example:
// grpc.Errorf(codes.FailedPrecondition, "Couldn't find any users in the chatroom")

type AuthService struct {
	Handler db.Handler
	Jwt     utils.JwtWrapper
}

func (s *AuthService) Register(ctx context.Context, req *library.RegisterRequest) (*library.RegisterResponse, error) {
	var user models.User

	if result := s.Handler.Database.Where(&models.User{Email: req.Email}).First(&user); result.Error == nil {
		return &library.RegisterResponse{
			Status: http.StatusConflict,
			Error:  "E-Mail already exists",
		}, nil
	}

	user.Email = req.Email
	user.Password = utils.HashPassword(req.Password)

	s.Handler.Database.Create(&user)

	return &library.RegisterResponse{
		Status: http.StatusCreated,
	}, nil
}

func (s *AuthService) Login(ctx context.Context, req *library.LoginRequest) (*library.LoginResponse, error) {
	var user models.User

	if result := s.Handler.Database.Where(&models.User{Email: req.Email}).First(&user); result.Error != nil {
		return &library.LoginResponse{
			Status: http.StatusNotFound,
			Error:  "User not found",
		}, nil
	}

	match := utils.CheckPasswordHash(req.Password, user.Password)

	if !match {
		return &library.LoginResponse{
			Status: http.StatusNotFound,
			Error:  "User not found",
		}, nil
	}

	token, _ := s.Jwt.GenerateToken(user)

	return &library.LoginResponse{
		Status: http.StatusOK,
		Token:  token,
	}, nil
}

func (s *AuthService) Validate(ctx context.Context, req *library.ValidateRequest) (*library.ValidateResponse, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)

	if err != nil {
		return &library.ValidateResponse{
			Status: http.StatusBadRequest,
			Error:  err.Error(),
		}, nil
	}

	var user models.User

	if result := s.Handler.Database.Where(&models.User{Email: claims.Email}).First(&user); result.Error != nil {
		return &library.ValidateResponse{
			Status: http.StatusNotFound,
			Error:  "User not found",
		}, nil
	}

	return &library.ValidateResponse{
		Status: http.StatusOK,
		UserId: user.Id,
	}, nil
}

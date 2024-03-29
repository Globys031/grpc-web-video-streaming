package auth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Globys031/grpc-web-video-streaming/authServer/go/db"
	"github.com/Globys031/grpc-web-video-streaming/authServer/go/models"

	library "github.com/Globys031/grpc-web-video-streaming/authServer/go/protoLibrary"
	"github.com/Globys031/grpc-web-video-streaming/authServer/go/utils"
	"github.com/go-playground/validator"
)

// Return http status codes instead of grpc ones. This way additional conversion
// from grpc to htpp codes on the frontend side can be avoided

type AuthService struct {
	library.UnimplementedAuthServiceServer

	Handler db.Handler
	Jwt     utils.JwtWrapper
}

// use a single instance of Validate, it caches struct info (used for user struct validation)
var validate *validator.Validate

func (s *AuthService) Register(ctx context.Context, req *library.RegisterRequest) (*library.RegisterResponse, error) {
	var user models.User

	// Sql check if user with that email already exists and if there's no error from the server
	// Will return nil if there isn't
	resultEmail := s.Handler.Database.Where(&models.User{Email: req.Email}).First(&user)
	resultUsername := s.Handler.Database.Where(&models.User{Username: req.Username}).First(&user)

	if resultEmail.Error == nil && resultUsername.Error == nil {
		return &library.RegisterResponse{
			Status: http.StatusConflict,
			Error:  "Username and E-mail already exists",
		}, nil
	} else if resultEmail.Error == nil {
		return &library.RegisterResponse{
			Status: http.StatusConflict,
			Error:  "E-Mail already exists",
		}, nil
	} else if resultUsername.Error == nil {
		return &library.RegisterResponse{
			Status: http.StatusConflict,
			Error:  "Username already exists",
		}, nil
	}

	user.Username = req.Username
	user.Email = req.Email
	// Password hashes right after validation. Otherwise, wouldn't be able
	// to properly check what length the string is
	user.Password = req.Password
	user.Role = req.Role

	if err := s.validateUser(user); err != nil {
		return &library.RegisterResponse{
			Status: http.StatusInternalServerError,
			Error:  "User data validation didn't succeed on the server side",
		}, err
	}
	user.Password = utils.HashPassword(req.Password)

	var result = s.Handler.Database.Create(&user)
	if result.Error != nil {
		// Possible situation where postgre server was initially up, but later crashed
		return &library.RegisterResponse{
			Status: http.StatusServiceUnavailable,
			Error:  "Sql server is down or it couldn't process user creation",
		}, result.Error
	}

	return &library.RegisterResponse{
		Status: http.StatusCreated,
	}, nil
}

func (s *AuthService) Login(ctx context.Context, req *library.LoginRequest) (*library.LoginResponse, error) {
	var user models.User

	if result := s.Handler.Database.Where(&models.User{Username: req.Username}).First(&user); result.Error != nil {
		return &library.LoginResponse{
			Status: http.StatusNotFound,
			Error:  "User not found",
		}, nil
	}

	match := utils.CheckPasswordHash(req.Password, user.Password)

	if !match {
		return &library.LoginResponse{
			Status: http.StatusNotFound,
			Error:  "Incorrect password for this username",
		}, nil
	}

	token, _ := s.Jwt.GenerateToken(user)
	fmt.Println(token)

	// Regular model is necessary for fetching user data from database
	// and library user struct is needed for loginResponse
	libUser := convertToLibraryUser(&user)
	return &library.LoginResponse{
		Status:      http.StatusOK,
		Token:       token,
		UserDetails: libUser,
	}, nil
}

// User role isn't saved in the token and instead has to validate
// with the server, every time it tries to get access to restricted resource
// This is to avoid cases where a token was issued accidentally or hijacked
func (s *AuthService) Validate(ctx context.Context, req *library.ValidateRequest) (*library.ValidateResponse, error) {
	claims, err := s.Jwt.ValidateToken(req.Token)

	if err != nil {
		return &library.ValidateResponse{
			Status: http.StatusBadRequest,
			Error:  err.Error(),
		}, nil
	}

	var user models.User
	accessRole := &req.Role

// Haven't tested yet!

	// Validate based on whether that name in token
	// and access role in validateRequest matches an entry in database
	if result := s.Handler.Database.Where(&models.User{Username: claims.Username, Role: *accessRole}).First(&user); result.Error != nil {
		return &library.ValidateResponse{
			Status: http.StatusNotFound,
			Error:  "User not found",
		}, nil
	}

	// if result := s.Handler.Database.Where(&models.User{Username: claims.Username}).First(&user); result.Error != nil {
	// 	return &library.ValidateResponse{
	// 		Status: http.StatusNotFound,
	// 		Error:  "User not found",
	// 	}, nil
	// }

	return &library.ValidateResponse{
		Status: http.StatusOK,
		UserId: user.Id,
	}, nil
}

////////////////////////
// Helper functions ////
////////////////////////
// I'll keep them inaccessible from other modules

// Meant to validate that the data provided by frontend is of correct format
func (s *AuthService) validateUser(user models.User) error {
	validate := validator.New()
	validate.RegisterValidation("role", validateRole)

	err := validate.Struct(&user)
	if err != nil {
		// this check is only needed when your code could produce
		// an invalid value for validation such as interface with nil
		// value most including myself do not usually have code like this.
		if _, ok := err.(*validator.InvalidValidationError); ok {
			fmt.Println(err)
		}
	}
	return err
}

// Confirm that role is set to one of the three
func validateRole(fl validator.FieldLevel) bool {
	roleName := fl.Field().String()
	return roleName == "USER" || roleName == "MOD" || roleName == "ADMIN"
}

func convertToLibraryUser(user *models.User) *library.User {
	libUser := new(library.User)
	libUser.UserID = user.Id
	libUser.Username = user.Username
	libUser.Password = user.Password
	libUser.Email = user.Email
	libUser.Role = user.Role

	return libUser
}

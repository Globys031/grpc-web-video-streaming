package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	Postgres_user     string `mapstructure:"POSTGRES_USER"`
	Postgres_password string `mapstructure:"POSTGRES_PASSWORD"`
	Postgres_hostname string `mapstructure:"POSTGRES_HOSTNAME"`
	Postgres_port     int    `mapstructure:"POSTGRES_PORT"`
	Adminer_port      int    `mapstructure:"ADMINER_PORT"`

	JWT_secret_key string `mapstructure:"JWT_SECRET_KEY"`

	Gateway_frontend_port     int `mapstructure:"GATEWAY_FRONTEND_PORT"`
	Gateway_frontend_ssl_port int `mapstructure:"GATEWAY_FRONTEND_SSL_PORT"`
	Gateway_backend_port      int `mapstructure:"GATEWAY_BACKEND_PORT"`
	Gateway_backend_ssl_port  int `mapstructure:"GATEWAY_BACKEND_SSL_PORT"`

	Auth_frontend_port     int `mapstructure:"AUTH_FRONTEND_PORT"`
	Auth_frontend_ssl_port int `mapstructure:"AUTH_FRONTEND_SSL_PORT"`
	Auth_backend_port      int `mapstructure:"AUTH_BACKEND_PORT"`
	Auth_backend_ssl_port  int `mapstructure:"AUTH_BACKEND_SSL_PORT"`

	Streaming_frontend_port     int `mapstructure:"STREAMING_FRONTEND_PORT"`
	Streaming_frontend_ssl_port int `mapstructure:"STREAMING_FRONTEND_SSL_PORT"`
	Streaming_backend_port      int `mapstructure:"STREAMING_BACKEND_PORT"`
	Streaming_backend_ssl_port  int `mapstructure:"STREAMING_BACKEND_SSL_PORT"`

	Chat_frontend_port     int `mapstructure:"CHAT_FRONTEND_PORT"`
	Chat_frontend_ssl_port int `mapstructure:"CHAT_FRONTEND_SSL_PORT"`
	Chat_backend_port      int `mapstructure:"CHAT_BACKEND_PORT"`
	Chat_backend_ssl_port  int `mapstructure:"CHAT_BACKEND_SSL_PORT"`

	Comment_frontend_port     int `mapstructure:"COMMENT_FRONTEND_PORT"`
	Comment_frontend_ssl_port int `mapstructure:"COMMENT_FRONTEND_SSL_PORT"`
	Comment_backend_port      int `mapstructure:"COMMENT_BACKEND_PORT"`
	Comment_backend_ssl_port  int `mapstructure:"COMMENT_BACKEND_SSL_PORT"`
}

func LoadConfig() (c Config, err error) {
	viper.AddConfigPath("./config/env")
	viper.SetConfigName("dev")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&c)

	fmt.Println(c)
	return
}

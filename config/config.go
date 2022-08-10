package config

import "github.com/spf13/viper"

type Config struct {
	Database_URL   string `mapstructure:"DB_URL"`
	JWT_secret_key string `mapstructure:"JWT_SECRET_KEY"`

	Gateway_frontend_port     string `mapstructure:"GATEWAY_FRONTEND_PORT"`
	Gateway_frontend_ssl_port string `mapstructure:"GATEWAY_FRONTEND_SSL_PORT"`
	Gateway_backend_port      string `mapstructure:"GATEWAY_BACKEND_PORT"`
	Gateway_backend_ssl_port  string `mapstructure:"GATEWAY_BACKEND_SSL_PORT"`

	Auth_port     string `mapstructure:"AUTH_PORT"`
	Auth_ssl_port string `mapstructure:"AUTH_SSL_PORT"`

	Streaming_port     string `mapstructure:"STREAMING_PORT"`
	Streaming_ssl_port string `mapstructure:"STREAMING_SSL_PORT"`

	Chat_port     string `mapstructure:"CHAT_PORT"`
	Chat_ssl_port string `mapstructure:"CHAT_SSL_PORT"`

	Comment_port     string `mapstructure:"COMMENT_PORT"`
	Comment_ssl_port string `mapstructure:"COMMENT_SSL_PORT"`

	Postgre_port string `mapstructure:"POSTGRE_PORT"`

	Adminer_port string `mapstructure:"ADMINER_PORT"`
}

func LoadConfig() (c Config, err error) {
	viper.AddConfigPath("./config/envs")
	viper.SetConfigName("dev")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()

	if err != nil {
		return
	}

	err = viper.Unmarshal(&c)

	return
}

package db

import (
	"log"

	"github.com/Globys031/grpc-web-video-streaming/authServer/go/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Handler struct {
	Database *gorm.DB
}

func Init(url string) Handler {
	db, err := gorm.Open(postgres.Open(url), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}

	// The db.AutoMigrate function will create the table automatically for us as soon as we start this application.
	// Atkreipt demesi kad darau mounted storage tai gali but kad be reikalo bandysiu keliskart kurt table
	db.AutoMigrate(&models.User{})

	return Handler{db}
}

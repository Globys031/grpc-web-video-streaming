package db

import (
	"fmt"
	"log"

	"github.com/Globys031/grpc-web-video-streaming/authServer/go/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Handler struct {
	Database *gorm.DB
}

func Init(hostname string, user string, passwd string, db_name string, port string) Handler {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		hostname, user, passwd, db_name, port)

	fmt.Println(dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}

	// The db.AutoMigrate function will create the table automatically for us as soon as we start this application.
	// Atkreipt demesi kad darau mounted storage
	db.AutoMigrate(&models.User{})

	return Handler{db}
}

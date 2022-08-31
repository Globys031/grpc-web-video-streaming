package db

import (
	"fmt"
	"log"

	"github.com/Globys031/grpc-web-video-streaming/authServer/go/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm" // https://github.com/go-gorm/gorm
)

type Handler struct {
	Database *gorm.DB
}

func Init(hostname string, user string, passwd string, db_name string, port int) Handler {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable client_encoding=UTF8",
		hostname, user, passwd, db_name, port)

	fmt.Println(dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln(err)
	}

	// The db.AutoMigrate function will create the table automatically
	// as soon as the application is started.
	// Atkreipt demesi kad darau mounted storage. Kiekvienas naujas konteineris naudoja nauja volume
	// Taciau jeigu sugalvosiu naudot tables nuo seno konteinerio volume, gali kilt problemu
	if err := db.AutoMigrate(&models.User{}); err == nil {
		fmt.Println("Users table created")
	}

	return Handler{db}
}

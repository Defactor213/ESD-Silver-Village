package db

import (
	"log"
	"os"

	"github.com/smu-esd-silver-village/code/src/auth/tracing"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
)

func init() {
	var databaseURL = os.Getenv("DATABASE_URL")
	var err error

	var driverName = tracing.InitWrappedSQLDriver()

	DB, err = gorm.Open(
		postgres.New(
			postgres.Config{
				DriverName: driverName,
				DSN:        databaseURL,
			},
		),
		&gorm.Config{},
	)

	if err != nil {
		log.Fatal(err)
	}

	DB.AutoMigrate(&User{})

	log.Println("Connected to db")

	seed()
}

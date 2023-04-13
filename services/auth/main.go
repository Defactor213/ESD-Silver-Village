package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smu-esd-silver-village/code/src/auth/db"
	"github.com/smu-esd-silver-village/code/src/auth/routes"
	"github.com/smu-esd-silver-village/code/src/auth/tracing"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	r := gin.Default()

	r.Use(tracing.Middleware)

	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(
			http.StatusOK,
			gin.H{
				"status": "ok",
			})
	})

	r.Use()

	r.POST("/login", routes.Login)
	r.POST("/signup", routes.Signup)

	r.GET("/me", routes.Me)
	r.GET("/users/:userId", routes.GetUser)

	defer func() {
		sqlDB, err := db.DB.DB()
		if err != nil {
			log.Fatal(err)
		}

		err = sqlDB.Close()
		if err != nil {
			log.Fatal(err)
		}
	}()

	r.Run()
}

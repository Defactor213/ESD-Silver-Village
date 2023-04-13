package routes

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smu-esd-silver-village/code/src/auth/db"
	"github.com/smu-esd-silver-village/code/src/auth/tracing"
)

func Me(c *gin.Context) {
	var customID = c.GetHeader("X-Consumer-Custom-ID")

	zipkinContext, _ := c.Get(tracing.GIN_KEY_CONTEXT)

	var user db.User

	var err = db.DB.
		WithContext(zipkinContext.(context.Context)).
		First(&user, customID).
		Error

	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	c.JSON(
		http.StatusOK,
		gin.H{
			"status": "ok",
			"user":   user,
		},
	)
}

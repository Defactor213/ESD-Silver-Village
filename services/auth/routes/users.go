package routes

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smu-esd-silver-village/code/src/auth/db"
	"github.com/smu-esd-silver-village/code/src/auth/tracing"
)

func GetUser(c *gin.Context) {
	var customID = c.GetHeader("X-Consumer-Custom-ID")

	userId, _ := c.Params.Get("userId")

	if len(customID) > 0 && customID != userId {
		c.JSON(
			http.StatusForbidden,
			gin.H{
				"status": "failure",
			},
		)
		return
	}

	zipkinContext, _ := c.Get(tracing.GIN_KEY_CONTEXT)

	var user db.User

	var err = db.DB.
		WithContext(zipkinContext.(context.Context)).
		First(&user, userId).
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

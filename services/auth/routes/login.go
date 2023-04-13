package routes

import (
	"context"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/smu-esd-silver-village/code/src/auth/db"
	"github.com/smu-esd-silver-village/code/src/auth/session"
	"github.com/smu-esd-silver-village/code/src/auth/tracing"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	zipkinContext, _ := c.Get(tracing.GIN_KEY_CONTEXT)

	var user db.User
	var err error

	err = db.DB.
		WithContext(zipkinContext.(context.Context)).
		Where("username = ?", username).
		First(&user).
		Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		log.Println(err)
		c.Status(http.StatusForbidden)
		return
	} else if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		log.Println(err)
		c.Status(http.StatusForbidden)
		return
	}

	session.InitUserSession(c, user)

	c.JSON(
		http.StatusOK,
		gin.H{
			"status": "ok",
			"user":   user,
		},
	)
}

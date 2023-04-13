package routes

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/mail"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgconn"
	"github.com/smu-esd-silver-village/code/src/auth/db"
	"github.com/smu-esd-silver-village/code/src/auth/messagebus"
	"github.com/smu-esd-silver-village/code/src/auth/session"
	"github.com/smu-esd-silver-village/code/src/auth/tracing"
	passwordvalidator "github.com/wagslane/go-password-validator"
	"github.com/wagslane/go-rabbitmq"
	"golang.org/x/crypto/bcrypt"
)

func Signup(c *gin.Context) {
	email := c.PostForm("email")
	username := c.PostForm("username")
	password := c.PostForm("password")
	displayName := c.PostForm("displayName")

	if len(email) == 0 || len(username) == 0 || len(password) == 0 || len(displayName) == 0 {
		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"status":  "invalid",
				"message": "missing field(s)",
			},
		)
		return
	}

	_, err := mail.ParseAddress(email)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"status":  "invalid",
				"message": "invalid email address",
			},
		)
		return
	}

	err = passwordvalidator.Validate(password, 60)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"status":  "invalid",
				"message": err.Error(),
			},
		)
		return
	}

	zipkinContext, _ := c.Get(tracing.GIN_KEY_CONTEXT)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	var user = db.User{
		Email:        email,
		Username:     username,
		PasswordHash: string(hashedPassword),
		DisplayName:  displayName,
	}

	err = db.DB.
		WithContext(zipkinContext.(context.Context)).
		Create(&user).
		Error

	if err != nil {
		var pgErr *pgconn.PgError

		if errors.As(err, &pgErr) {
			if pgErr.Message == "unique_violation" {
				c.JSON(http.StatusBadRequest, gin.H{
					"status":  "exists",
					"message": "either the username or email is already taken",
				})
				return
			}
		}

		log.Println(err)
		c.Status(http.StatusInternalServerError)
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

	// Send welcome email
	var message = messagebus.NotificationMessage{
		Recipient: user.Email,
		Template:  "welcome",
		Data: map[string]string{
			"display_name": user.DisplayName,
			"username":     user.Username,
		},
	}

	messageJSON, _ := json.Marshal(message)

	err = messagebus.Publisher.Publish(
		messageJSON,
		[]string{"notification.welcome"},
		rabbitmq.WithPublishOptionsContentType("application/json"),
		rabbitmq.WithPublishOptionsMandatory,
		rabbitmq.WithPublishOptionsPersistentDelivery,
		rabbitmq.WithPublishOptionsExchange("notification_topic"),
	)

	if err != nil {
		log.Println(err)
	}
}

package session

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/smu-esd-silver-village/code/src/auth/db"
	"github.com/smu-esd-silver-village/code/src/auth/kongadmin"
	"github.com/smu-esd-silver-village/code/src/auth/util"
)

const (
	COOKIE_KEY_TOKEN  = "token"
	COOKIE_EXPIRATION = int((24 * time.Hour) / time.Second)
)

func InitUserSession(c *gin.Context, user db.User) {
	// Find or create a consumer for this user
	consumer, err := kongadmin.FindOrCreateConsumer(user)
	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	// Create a JWT credential under the consumer
	jwtCredential, err := kongadmin.AddJWTCredential(consumer)
	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	_, jwtTokenStr, err := encodeToken(jwtCredential)
	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	var rootURL = util.RootURL()

	c.SetCookie(
		COOKIE_KEY_TOKEN,
		jwtTokenStr,
		COOKIE_EXPIRATION,
		"/",
		rootURL.Hostname(),
		false,
		true,
	)
}

package session

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/kong/go-kong/kong"
)

func encodeToken(jwtAuth *kong.JWTAuth) (*jwt.Token, string, error) {
	var claims = jwt.MapClaims{}

	claims["iss"] = *jwtAuth.Key
	claims["exp"] = time.Now().Add(30 * 24 * 7 * time.Hour).Unix()

	var at = jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedString, err := at.SignedString([]byte(*jwtAuth.Secret))

	return at, signedString, err
}

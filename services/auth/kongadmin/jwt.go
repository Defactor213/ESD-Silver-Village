package kongadmin

import (
	"context"

	"github.com/kong/go-kong/kong"
)

func AddJWTCredential(consumer *kong.Consumer) (*kong.JWTAuth, error) {
	var algorithm = "HS256"

	return client.JWTAuths.Create(
		context.Background(),
		consumer.ID,
		&kong.JWTAuth{
			Consumer:  consumer,
			Algorithm: &algorithm,
			Secret:    nil,
		},
	)
}

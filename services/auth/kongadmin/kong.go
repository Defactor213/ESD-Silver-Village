package kongadmin

import (
	"log"
	"net/http"
	"os"

	"github.com/kong/go-kong/kong"
)

var (
	client  *kong.Client
	baseURL = os.Getenv("KONG_ADDR")
)

func init() {
	var err error
	client, err = kong.NewClient(&baseURL, http.DefaultClient)

	if err != nil {
		log.Fatal(err)
	}
}

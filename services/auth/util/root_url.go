package util

import (
	"log"
	"net/url"
	"os"
)

func RootURL() url.URL {
	var rootURL = os.Getenv("ROOT_URL")

	u, err := url.Parse(rootURL)
	if err != nil {
		log.Fatal(err)
	}

	return *u
}

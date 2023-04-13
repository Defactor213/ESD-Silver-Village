package messagebus

import (
	"log"
	"os"

	"github.com/rabbitmq/amqp091-go"
	"github.com/wagslane/go-rabbitmq"
)

var (
	rabbitMQURL = os.Getenv("RABBITMQ_URL")
	Publisher   *rabbitmq.Publisher
)

func init() {
	var err error
	Publisher, err = rabbitmq.NewPublisher(
		rabbitMQURL,
		amqp091.Config{},
		rabbitmq.WithPublisherOptionsLogging,
	)
	if err != nil {
		log.Fatal(err)
	}
	go func() {
		for r := range Publisher.NotifyReturn() {
			log.Printf("message returned from server: %s", string(r.Body))
		}
	}()
}

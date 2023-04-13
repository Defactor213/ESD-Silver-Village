package tracing

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	zipkinsql "github.com/openzipkin-contrib/zipkin-go-sql"
	"github.com/openzipkin/zipkin-go"
	zipkinhttp "github.com/openzipkin/zipkin-go/middleware/http"
	"github.com/openzipkin/zipkin-go/model"
	reporteramqp "github.com/openzipkin/zipkin-go/reporter/amqp"
)

const (
	GIN_KEY_CONTEXT = "zipkin-context"
)

var (
	rabbitMQURL = os.Getenv("RABBITMQ_URL")
	tracer      *zipkin.Tracer
)

func init() {
	reporter, err := reporteramqp.NewReporter(rabbitMQURL)
	if err != nil {
		log.Fatal(err)
	}

	var localEndpoint = &model.Endpoint{
		ServiceName: "auth",
		Port:        8080,
	}

	sampler, err := zipkin.NewCountingSampler(1)
	if err != nil {
		log.Fatal(err)
	}

	tracer, err = zipkin.NewTracer(
		reporter,
		zipkin.WithSampler(sampler),
		zipkin.WithLocalEndpoint(localEndpoint),
	)
	if err != nil {
		log.Fatal(err)
	}

}

func Middleware(c *gin.Context) {
	var middleware = zipkinhttp.NewServerMiddleware(
		tracer,
		zipkinhttp.SpanName(c.FullPath()),
	)

	middleware(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// HACK: Gin doesn't work well with Go context.Context
			// We'll just store the Zipkin-enhanced context in a Gin Context value
			c.Set(GIN_KEY_CONTEXT, r.Context())
			c.Next()
		}),
	).ServeHTTP(c.Writer, c.Request)
}

func InitWrappedSQLDriver() string {
	driverName, err := zipkinsql.Register(
		"postgres",
		tracer,
		zipkinsql.WithAllTraceOptions(),
	)

	if err != nil {
		log.Fatal(err)
	}

	return driverName
}

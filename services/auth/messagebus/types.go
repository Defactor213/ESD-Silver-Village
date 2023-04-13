package messagebus

type NotificationMessage struct {
	Recipient string            `json:"recipient"`
	Template  string            `json:"template"`
	Data      map[string]string `json:"data"`
}

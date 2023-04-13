package kongadmin

import (
	"context"
	"log"
	"strconv"

	"github.com/kong/go-kong/kong"
	"github.com/smu-esd-silver-village/code/src/auth/db"
)

func FindOrCreateConsumer(user db.User) (*kong.Consumer, error) {
	var err error

	consumer, _ := client.Consumers.GetByCustomID(
		context.Background(),
		&user.Email,
	)

	// Delete older consumer to prevent username conflict
	if consumer != nil {
		err = client.Consumers.Delete(
			context.Background(),
			consumer.ID,
		)

		if err != nil {
			log.Println(err)
			return nil, err
		}
	}

	var customID = strconv.Itoa(int(user.ID))

	consumer, err = client.Consumers.GetByCustomID(
		context.Background(),
		&customID,
	)
	if err == nil {
		return consumer, nil
	}

	consumer, err = client.Consumers.Create(
		context.Background(),
		&kong.Consumer{
			ID:       nil,
			CustomID: &customID,
			Username: &user.Username,
		},
	)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	var managerRole = "manager"

	if user.Role != nil && *user.Role == managerRole {
		// Create ACL

		_, err := client.ACLs.Create(
			context.Background(),
			consumer.ID,
			&kong.ACLGroup{
				Consumer: consumer,
				Group:    &managerRole,
			},
		)

		if err != nil {
			log.Println(err)
			return nil, err
		}
	}

	return consumer, nil
}

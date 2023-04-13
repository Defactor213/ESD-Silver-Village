package db

import (
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm/clause"
)

func seed() {
	var managerPassword = "manager"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(managerPassword), bcrypt.DefaultCost)

	var role = "manager"

	var manager = User{
		Email:        "manager@example.com",
		Username:     "manager",
		DisplayName:  "John Smith",
		PasswordHash: string(hashedPassword),
		Role:         &role,
	}

	var err = DB.
		Clauses(
			clause.OnConflict{
				Columns: []clause.Column{
					{Name: "username"},
				},
				DoUpdates: clause.AssignmentColumns(
					[]string{
						"display_name",
						"role",
						"password_hash",
						"email",
					},
				),
			},
		).
		Create(
			&manager,
		).
		Error

	if err != nil {
		log.Fatal(err)
	}
}

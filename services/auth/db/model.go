package db

type User struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	Email        string  `gorm:"column:email;unique;not null" json:"email"`
	Username     string  `gorm:"column:username;unique;not null" json:"username"`
	DisplayName  string  `gorm:"column:display_name;not null" json:"display_name"`
	PasswordHash string  `gorm:"column:password_hash;not null" json:"-"`
	Role         *string `gorm:"column:role;default:NULL;check:role IS NULL OR role = 'manager'" json:"role"`
}

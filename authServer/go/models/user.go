package models

// https://github.com/lib/pq

// https://medium.com/@apzuk3/input-validation-in-golang-bc24cdec1835
type User struct {
	Id       int64  `json:"id" gorm:"primaryKey" ` // Automatically incremented by database
	Username string `json:"username" validate:"required,max=20,min=6"`

	Password string `json:"password" validate:"required,max=40,min=8"`
	Email    string `json:"email" validate:"required,email"`

	// Think it's best to have a single role in this case. Avoids additional array inspection
	Role string `json:"role" validate:"required,role"`
	// Will get "undefined" error on frontend side if user has no roles.
	// Roles pq.StringArray `json:"roles" gorm:"type:text[]" validate:"required"`
}

# Authentication
[![made-with-Go](https://img.shields.io/badge/Made%20with-Go-1f425f.svg)](https://go.dev/)

This is the authentication microservice. 

### Features
- Password hashing (using bcrypt)
- Zipkin instrumentation
- Upon login/signup, a Kong consumer and JWT credential is created. A JSON Web Token (JWT) is subsequently created and set as a session cookie.

### Routes
- `[POST}` `/signup`
- `[POST}` `/login`
- `[GET]` `/me`

### Store
A PostgreSQL database is required for this service (it is the `auth-postgres` service in Docker Compose).

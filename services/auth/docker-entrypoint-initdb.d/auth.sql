CREATE DATABASE auth_service;

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY, 
  email         VARCHAR(100) NOT NULL UNIQUE,
  username      VARCHAR(50) NOT NULL UNIQUE,
  display_name  VARCHAR(100) NOT NULL,
  password_hash VARCHAR(64) NOT NULL
);


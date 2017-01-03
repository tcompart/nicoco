CREATE TABLE user (
  id UUID as random_uuid() PRIMARY KEY NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created TIMESTAMP,
  logedin TIMESTAMP,
  passwordHash VARCHAR(255)
);
-- psql --host=localhost --port=5432 --username=postgres --echo-all --file=database.sql

CREATE DATABASE service_dashboard_hecate_email
WITH ENCODING 'UTF8'
     LC_COLLATE 'en_US.UTF-8'
     LC_CTYPE 'en_US.UTF-8'
     TEMPLATE template0;

\connect service_dashboard_hecate_email;

DROP ROLE IF EXISTS hecate_email;

--------------------------------------------------------------------------------
-- EMAIL MODULE
--------------------------------------------------------------------------------

CREATE ROLE hecate_email WITH LOGIN PASSWORD '### UPDATE ###';

CREATE TABLE IF NOT EXISTS verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);
 
ALTER TABLE verification_token OWNER TO hecate_email;

CREATE TABLE IF NOT EXISTS accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
 
  PRIMARY KEY (id)
);

ALTER TABLE accounts OWNER TO hecate_email;

CREATE TABLE IF NOT EXISTS sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
 
  PRIMARY KEY (id)
);

ALTER TABLE sessions OWNER TO hecate_email;

CREATE TABLE IF NOT EXISTS users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
 
  PRIMARY KEY (id)
);
 
ALTER TABLE users OWNER TO hecate_email;
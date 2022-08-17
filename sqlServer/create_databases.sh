#!/bin/bash
# Has to be connected as the postgresql database root user to work

# initialise database cluster and start postgre server
/usr/pgsql-${POSTGRES_MAJOR_VERSION}/bin/initdb -D ${PGDATA}
/usr/pgsql-${POSTGRES_MAJOR_VERSION}/bin/pg_ctl -D /etc/postgresql/ start

# create database for privileged user and drop the one made during the installation
if [ "${POSTGRES_USER}" != 'postgres' ]; then
  createdb ${POSTGRES_USER}
  # Checked that there's no need for this line:
  # psql -c "DROP DATABASE IF EXISTS postgres;"
fi

# Also no need:
# psql -c "ALTER USER "${POSTGRES_USER}" WITH PASSWORD '${POSTGRES_PASSWORD}';"

# Create databases for other microservices
createdb "auth_svc"
# Dabar tegul buna, kad cia sukuria, bet veliau bus taip, kad kiekvienas mikroservisas
# turi atskira savo duombazes mikroservisa. Tai butu gerai kad ten susikurtu, kokiu jam reikia
# duombaziu. Dar pamastyt del sito reiktu, kaip butu geriausia isskirstyt duombazes.
# a) kiekvienam mikroservisui atskira duombazes konteineri
# b) visi mikroservisai ta pati duombazes konteineri tik su skirtingom duombazem ir privilegijom
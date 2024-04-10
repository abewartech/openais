---
# Hugo Key Value pairs 
title: Quick Start
comments: false
weight: 5
---


This project demonstrates the quickest way to get a bare-bones version of OpenAIS up and running. By default it pulls AIS data from the Norwegian coastguard's server (open and free data) and runs it through the various python streaming containers, into the DB and then exposes it via a geospatial API. 

This has been tested on an Ubuntu server with the following installed:

 * **Ubuntu Version**: Ubuntu 22.04.4 LTS
 * **Docker Version**: 26.0.0 Community Edition
 * **CPU**: Intel(R) Xeon(R) Gold 6334 CPU @ 3.60GHz
 * **RAM**: 8 GB
 * **Disk Space**: ~100 GB

**Note**: Remember to add your user to the [docker group](https://docs.docker.com/engine/install/linux-postinstall/). 

# Deploy

To get the code running do the following:

```BASH
git clone git@gitlab.com:openais/deployment/quick-start.git
cd quick-start
cp config/example.env .env
nano .env
# Edit the environment file to represent your current environment
docker compose pull
docker compose up -d
```
This should bring up the various containers in a detached mode. The database might take a while to come up the first time as it will (if FETCH_GEOM != False) download publically available geometry files from a remote server. To check whether everything is up you can run: 
```BASH
USER$ docker ps
CONTAINER ID   IMAGE                                                                COMMAND                  CREATED        STATUS                  PORTS                                                                                      NAMES
4a985f76fb41   registry.gitlab.com/openais/processing/db-sink:latest                "python /usr/local/d…"   23 hours ago   Up 23 hours                                                                                                        db_inserter
89dadc28742c   registry.gitlab.com/openais/processing/ais_decoder:latest            "python /usr/local/a…"   23 hours ago   Up 23 hours                                                                                                        ais_decoder
5048066225e9   registry.gitlab.com/openais/processing/ais-i-mov:latest              "python /usr/local/a…"   23 hours ago   Up 23 hours                                                                                                        ais_i_mov
5157c8fcd2cf   pramsey/pg_featureserv:latest                                        "./pg_featureserv"       23 hours ago   Up 23 hours             0.0.0.0:9000->9000/tcp                                                                     featserv
047d1b3c7c0d   registry.gitlab.com/openais/processing/integrated-database:staging   "/docker-entrypoint.…"   23 hours ago   Up 23 hours (healthy)   8008/tcp, 8081/tcp, 0.0.0.0:15433->5432/tcp                                                database
3ae1be97d1e7   rabbitmq:3.9.24-management                                           "docker-entrypoint.s…"   23 hours ago   Up 23 hours (healthy)   4369/tcp, 5671-5672/tcp, 15671/tcp, 15691-15692/tcp, 25672/tcp, 0.0.0.0:15672->15672/tcp   rabbitmq
```
All containers should be "Up". 
To check whether everything is operating as expected you can either check the logs:

```BASH
docker compose logs -f --tail 100 db_inserter
WARN[0000] /home/VLIZ2000/rory.meyer/git/quick-start/docker-compose.yaml: `version` is obsolete 
db_inserter  | 2024-04-10 07:49:49,008 - WARNING - main.message_proc - Insert 21:
db_inserter  | 2024-04-10 07:49:49,008 - WARNING - main.message_proc - 'type_and_cargo'
db_inserter  | 2024-04-10 07:49:49,008 - WARNING - main.message_proc - Dropping type 21 messages waiting to get inserted...
db_inserter  | 2024-04-10 07:49:49,009 - INFO - main.message_proc - 28.033631830339978 Msg/Sec. Processed 180 messages in 6.420859098434448 seconds.
```
At this point it is safe to ignore the warnings regarding Type 21 AIS messages (Aid-to-Navigation Messages). This log shows that messages are being succesfully received, decoded and inserted into the database. 

In some instances it seems that TimeScaleDB does not automatically [populate continuous aggregates on first build](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/troubleshooting/). To fix this you should call the "ais.ais_populate_cagg" procedure using PGAdmin or PSQL or some other method of running SQL in the DB:

```SQL
-- CALL ais.ais_populate_cagg(FirstDataDate,LastDataDate ) 
CALL ais.ais_populate_cagg('2024-04-08','2024-04-10' ) 
```
# API
The API is based off [PG_FeatureServ](https://github.com/CrunchyData/pg_featureserv); a lightweight geospatial API tool for PostGIS. There are several end-points that can be used to query data, once AIS messages are being ingested and continuous aggregates have been populated. The API should be available at the url *host_machine:9000* by default. 

AIS data is published as "Collections" and several are available. These are [defined by views](https://gitlab.com/openais/processing/integrated-database/-/blob/master/build/db_init_scripts/301_api_functions.sql?ref_type=heads) in the database published to the "postgis_ftw" schema. 

# ENV Config

This is a description of the environment variables used to deploy the container stack. These can be left at their default or changed to reflect your specific instance.  
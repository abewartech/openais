# Quick Start

This project demonstrates the quickest way to get a bare-bones version of OpenAIS up and running. By default it pulls AIS data from the Norwegian coastguard's server (open and free data) and runs it through the various python streaming containers, into the DB and then exposes it via a geospatial API. 

This has been tested on an Ubuntu server with the following installed:

 * **Ubuntu Version**: 
 * **Docker Version**:  
 * **CPU**:
 * **RAM**:
 * **Disk Space**:

To get the code running do the following:

```

```




This is a template for docker services being deployed by Portainer. The general step to using for a new deployment project this would be:

 - Create a new Git Repo and use this as the template
 - Complete the portainer.yaml file. This is intended to be deployed using Portainer. A seperate docker-compose.yaml file can be create for straight docker compose deployments
 - Ensure the example.env file is complete

More information here:
https://docs.gitlab.com/ee/user/group/custom_project_templates.html
Oh wait... this isn't available on the CE version.
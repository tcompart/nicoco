# nicoco 

This is the user management backend for the nicoco website. 
The website can be found under *[nicoco.de](https://www.nicoco.de)*

## Local Development

You will have to start a docker daemon locally.
E.g. with Mac OS X use [those instructions](https://docs.docker.com/machine/get-started/).

Then you will be able to execute the following statements:

    docker-machine start
    docker-machine env
    export DOCKER_HOST="tcp://YOUR-IP:DOCKER_PORT"

With this one running you can execute all tests and deployments from your local machine.    

To see if a docker daemon is really running you can also execute ```docker-maschine ls``` and export this as *DOCKER_HOST* system variable.
    
## Local Development with intellij idea

You are able to add *Docker* Runner with intellij idea, and linking it to the locally runnin docker daemon.
    
## Contributions

If you want to contribute you are more than welcomed. I am open to merge
requests and any think that keeps you from using this code.

However you will have to send merge requests with the following pre-conditions met:

- you forked this repository
- you rebased against the master
- you squashed your commits
- you run all inspections (nicoco inspections, intellij idea inspections)
- you run all tests and enforcer plugin ```mvn clean verify```
- you build the docker image and run it locally and it started as excepted
- the integration tests were successful

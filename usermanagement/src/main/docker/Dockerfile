FROM cgswong/java:openjdk8
MAINTAINER torsten.compart@gmail.com
VOLUME /tmp
ADD usermanagement-0.1-SNAPSHOT.jar app.jar

RUN sh -c 'touch /app.jar'

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

# HTTP Port
EXPOSE 8080

# SSH Port
EXPOSE 7999
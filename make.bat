@ECHO OFF

SET TZ=America/Sao_Paulo
SET USER_ID=1000
SET GROUP_ID=1000
SET CHOKIDAR_USEPOOLING=1
SET PWD=./

IF "~%2" == "~" (
    SET PORT=80
    echo port is 80
) ELSE (
    SET PORT=%2
    echo port is %2
)

IF "~%1" == "~" (
    SET COMMAND=run
) ELSE (
    SET COMMAND=%1
)

IF "%COMMAND%" == "run" (
    docker-compose run --service-ports --rm app
) ELSE IF "%COMMAND%" == "in" (
    docker-compose exec app /bin/bash
) ELSE IF "%COMMAND%" == "mysql" (
    docker-compose exec taller-chat-db mysql
) ELSE IF "%COMMAND%" == "stop" (
    docker-compose stop
) ELSE IF "%COMMAND%" == "clean" (
    docker-compose down
    docker rmi taller-chat-app
) ELSE IF "%COMMAND%" == "build" (
    docker-compose build app
)

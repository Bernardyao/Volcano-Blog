@echo off
REM Navigate to the deploy directory
cd %~dp0

REM Build and start the Docker containers
docker-compose up -d --build

echo Frontend deployment completed successfully!
echo Your application should be available at http://your-server-ip

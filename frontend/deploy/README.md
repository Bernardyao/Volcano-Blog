# Volcano Blog - Frontend Deployment

This directory contains Docker configuration files for deploying the Volcano Blog frontend application.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git installed on your server

## Deployment Steps

1. Clone the repository:
   ```
   git clone https://github.com/Bernardyao/Volcano-Blog.git
   cd Volcano-Blog/frontend
   ```

2. Deploy with Docker Compose:
   ```
   cd deploy
   docker-compose up -d
   ```

## Configuration Options

- The frontend will be available on port 80 by default
- To change the port, edit the `docker-compose.yml` file

## Notes

- The Nginx configuration is set up to handle Vue.js routing
- Static assets are cached for 30 days
- Security headers are added for better protection

## Troubleshooting

If you encounter any issues:

1. Check Docker logs:
   ```
   docker logs volcano-frontend
   ```

2. Verify Nginx configuration:
   ```
   docker exec -it volcano-frontend nginx -t
   ```

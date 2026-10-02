# Docker Setup for Retro Website

You can run the Retro website using Docker with either **Docker CLI** or **Docker Compose**.

---

### Option 1: Using Docker Compose (Recommended)

#### From the `docker/` folder:
```bash
cd docker
docker compose up -d
```

#### From the project root:
```bash
docker compose -f docker/docker-compose.yml up -d
```

Open your browser and navigate to: **http://localhost:8080**

To stop the container:
```bash
docker compose down
```

---

### Option 2: Using Docker CLI Directly

From the project root:
```bash
# Build the Docker image
docker build -t retro-web -f docker/Dockerfile .

# Run the container
docker run -d -p 8080:80 --name retro-website retro-web
```

Open your browser and navigate to: **http://localhost:8080**

To stop and remove the container:
```bash
docker stop retro-website
docker rm retro-website
```

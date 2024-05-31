# Base image on Node.js latest LTS
FROM node:lts-alpine

# Create app directory
WORKDIR /app/anomalousspace

# Bundle app source
COPY . .

# Change directory to src/server/
WORKDIR /app/anomalousspace/src/server/

# Install only production npm modules specified in package.json
RUN npm ci --omit=dev

# Expose container's port 4000
EXPOSE 4000

# Launch server
CMD ["node", "index.js"]

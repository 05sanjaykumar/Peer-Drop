# Start from a lightweight Go base image
FROM golang:1.24.2-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum first (better caching)
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the Go app (output binary named 'server')
RUN go build -o server .

# Expose the port used by your WebSocket server
EXPOSE 8080

# Command to run the binary
CMD ["./server"]

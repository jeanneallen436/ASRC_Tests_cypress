Generated certificate for running these tests on my machine like this:
# Navigate to your cypress project directory
cd /path/to/your/cypress/project

# Generate private key
openssl genrsa -out server.key 2048

# Generate self-signed certificate
openssl req -new -x509 -key server.key -out server.crt -days 365
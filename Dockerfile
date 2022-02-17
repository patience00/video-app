# The FROM instruction sets the Base Image for subsequent instructions.
# Using Nginx as Base Image
FROM node:8
RUN mkdir /app
WORKDIR /app
COPY . /app/
# The RUN instruction will execute any commands
# Adding HelloWorld page into Nginx server
RUN npm install

# The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime
EXPOSE 3000

# The CMD instruction provides default execution command for an container
# Start Nginx and keep it from running background
CMD npm start
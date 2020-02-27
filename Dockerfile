FROM node:8

WORKDIR /usr/src/tic-tac-toe
COPY ./ ./
RUN npm install

# EXPOSE 3000
CMD [ "npm", "run", "web-server" ]
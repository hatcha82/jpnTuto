FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm install --only=production
# docker run -p 8088:8088 -e API_URL="'localhost:8080'"  hatcha82:0.01
#API_URL 서비스를 제공할 서버의 주소 :  반드시 "'IP:PORT'" 전달 필요

# Bundle app source
COPY . .

EXPOSE 8088
#API_URL 서비스를 제공할 서버의 주소 :  반드시 "'IP:PORT'" 전달 필요
ENV API_URL "'106.10.51.131:8080'"
CMD echo ${API_URL}
CMD [ "npm", "start" ]
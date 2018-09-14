FROM nginx
RUN npm install --only=production
COPY ./dist /usr/share/nginx/html
EXPOSE 80

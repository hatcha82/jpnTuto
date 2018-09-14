FROM nginx
RUN npm install --only=production
RUN npm run build
COPY ./dist /usr/share/nginx/html
EXPOSE 80

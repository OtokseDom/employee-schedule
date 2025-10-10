# Use nginx to serve static files
FROM nginx:alpine

# Remove default html
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-built React app
COPY ./dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

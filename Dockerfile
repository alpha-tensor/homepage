# Production image: install, build (including the static prerender), and serve
# the built assets with vite preview. The dev-only `npm run dev` mode is not
# used in production.
FROM node:20-alpine

COPY . /app/
WORKDIR /app
RUN npm ci
RUN npm run build

EXPOSE 3000
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000", "--strictPort"]

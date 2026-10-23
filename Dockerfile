FROM node:24-alpine

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=5001 \
    UPLOAD_DIR=/app/uploads \
    NODE_OPTIONS=--max-old-space-size=256

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --chown=node:node . .
RUN mkdir -p /app/uploads && chown node:node /app/uploads
USER node

EXPOSE 5001
VOLUME ["/app/uploads"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null || exit 1

CMD ["node", "server.js"]

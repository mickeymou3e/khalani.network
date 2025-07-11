FROM redis:7-alpine

# for production deployment change run with
# docker build --build-arg password=your new password ./db/Dockerfile
ARG password=redis
ENV REDIS_PASSWORD $password

EXPOSE 6379

CMD ["sh", "-c", "redis-server --appendonly yes --requirepass $REDIS_PASSWORD"]
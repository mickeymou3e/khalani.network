FROM postgres:14

# for production deployment change run with
# docker build --build-arg password=your new password ./db/Dockerfile
ARG password=postgres
ENV POSTGRES_PASSWORD $password
ENV POSTGRES_DB hub

EXPOSE 5432
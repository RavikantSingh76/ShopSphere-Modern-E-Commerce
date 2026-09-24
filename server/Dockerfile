# syntax=docker/dockerfile:1
# ------------------------------------------------------------
# Stage 1: Build Stage
# ------------------------------------------------------------
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and POM to leverage layer caching
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B || true

# Copy source files and package executable jar
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# ------------------------------------------------------------
# Stage 2: Hardened Runtime Stage
# ------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Create unprivileged system group and user
RUN addgroup -S spring && adduser -S spring -G spring

# Copy compiled artifact from build stage
COPY --from=builder --chown=spring:spring /build/target/*.jar app.jar

USER spring:spring

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"
ENV SPRING_PROFILES_ACTIVE=prod

HEALTHCHECK --interval=15s --timeout=5s --retries=5 --start-period=30s \
  CMD wget -q --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

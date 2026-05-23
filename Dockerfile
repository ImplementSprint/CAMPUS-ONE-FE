FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web-lms/package.json ./apps/web-lms/package.json
COPY apps/web-school/package.json ./apps/web-school/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/shared-contracts/package.json ./packages/shared-contracts/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app

ARG APP_NAME
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://api.itsandbox.site
ENV NEXT_PUBLIC_API_BASE_URL=https://api.itsandbox.site
ENV NEXT_PUBLIC_LMS_BASE_URL=https://itsandbox.site
ENV NEXT_PUBLIC_SCHOOL_PORTAL_BASE_URL=https://app.itsandbox.site
ENV NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN=itsandbox.site
ENV NEXT_PUBLIC_SUPABASE_URL=https://campus-one-sandbox.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=sandbox-build-anon-key

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace apps/${APP_NAME}

FROM node:22-alpine AS runtime
WORKDIR /app

ARG APP_NAME
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP_NAME=${APP_NAME}
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=build /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=build /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

EXPOSE 3000
CMD ["sh", "-c", "node apps/${APP_NAME}/server.js"]

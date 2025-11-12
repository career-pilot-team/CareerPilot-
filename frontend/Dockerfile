FROM node:18-alpine

WORKDIR /app
RUN npm i -g http-server@14

# 정적 파일만 있으면 public/만 복사
# (CRA/Vite 개발 서버를 쓰는 경우엔 별도 Dockerfile 필요)
COPY public ./public

EXPOSE 3000
CMD ["http-server", "public", "-p", "3000", "-c-1"]
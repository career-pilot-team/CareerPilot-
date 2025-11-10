FROM node:18-alpine

# 작업 디렉토리
WORKDIR /app

# package.json과 package-lock.json 복사
# 의존성 먼저 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 환경변수 (원하면 수정)
ENV NODE_ENV=production

# 서버 포트
EXPOSE 4000

# 서버 실행
CMD ["npm", "start"]

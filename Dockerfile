# 构建阶段
FROM oven/bun:1 AS builder

WORKDIR /app

# 复制 package 文件
COPY package.json bun.lockb* ./

# 安装依赖
RUN bun install --frozen-lockfile

# 复制项目文件
COPY . .

# 生成类型
RUN bun run postinstall

# 构建项目
RUN bun run build

# 生产阶段
FROM oven/bun:1 AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NITRO_PRESET=node-server

# 复制构建产物
COPY --from=builder /app/.output .output
COPY --from=builder /app/package.json .

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["bun", "run", ".output/server/index.mjs"]

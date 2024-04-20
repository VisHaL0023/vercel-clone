# Vercel Clone

Deploy your vite/react project like on vercel in just 2 minutes.

### Setup Guide

This Project contains following services and folders:

- `api-server`: HTTP API Server for REST API's
- `build-server`: Docker Image code which clones, builds and pushes the build to S3
- `s3-reverse-proxy`: Reverse Proxy the subdomains and domains to s3 bucket static assets

### Local Setup

1. Run `npm install` in all the 3 services i.e. `api-server`, `build-server` and `s3-reverse-proxy`
2. Docker build the `build-server` and push the image to AWS ECR.
3. Setup the `api-server` by providing all the required config such as TASK ARN and CLUSTER arn.
4. Add all `environment` variables in all `services`.
5. Run `node index.js` in `api-server` and `s3-reverse-proxy`


At this point following services would be up and running:

| S.No | Service            | PORT    |
| ---- | ------------------ | ------- |
| 1    | `api-server`       | `:9000` |
| 2    | `socket.io-server` | `:9002` |
| 3    | `s3-reverse-proxy` | `:8000` |

### Demo

[Watch The Demo Video](https://drive.google.com/file/d/1e2jTvZJie4w1CwUP67CWhTgI3CU8lDGf/view?usp=sharing)

### Architecture

<img width="916" alt="Vercel-clone-diagram" src="https://github.com/VisHaL0023/vercel-clone/assets/73978467/173795c8-4b79-4788-8002-1b6c3bb05053">

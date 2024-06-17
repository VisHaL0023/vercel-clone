# Project Builder

Deploy your vite/react project like on vercel in just 2 minutes.

Note: **Due to cost issue I'm not uploading it to anywhere, just watch video for demo** -> [Demo](https://drive.google.com/file/d/1Bhjo2iPgWPHCduJ4dr4U6N3qybeuvbJ9/view?usp=sharing)
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

| S.No | Service                | PORT    |
| ---- | ---------------------- | ------- |
| 1    | `api-server`           | `:9000` |
| 2    | `kafka and clickhouse` | `:aiven`|
| 3    | `s3-reverse-proxy`     | `:8000` |


### Architecture
<img width="670" alt="Vercel-design" src="https://github.com/VisHaL0023/vercel-clone/assets/73978467/39b8258a-99ca-4c38-b51f-f18cc6a39bec">


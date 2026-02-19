# jamesmoessis.com

Personal portfolio site built. [Beads](https://github.com/steveyegge/beads) used experimentally to plan work and to give agents long term memory.

## Prerequisites

- [Node.js](https://nodejs.org/) v24.x and NPM
- [AWS CLI v2](https://docs.aws.amazon.com/cli/) configured with credentials for the target AWS account
- [Terraform](https://developer.hashicorp.com/terraform/downloads) v1.14.0 or later

## Getting Started

```bash
npm install

# Start the dev server
npm run dev
```

The site will be available at `http://localhost:5173/`.

## Available Scripts

| Command             | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Start Vite dev server with hot reload      |
| `npm run build`     | Type-check with `tsc` then build for prod  |
| `npm run preview`   | Preview the production build locally       |
| `npm run lint`      | Run ESLint                                 |

## Deploy to jamesmoessis.com

This project is deployed as static assets to S3 behind CloudFront.

Terraform infrastructure is defined in `infra/terraform` and uses a remote
S3 backend.

### 1. Build the react app

```bash
npm run build
```

### 2. Deploy static assets to S3

```bash
aws s3 sync dist/ s3://www.jamesmoessis.com --delete --exclude 'old-backup/*'
```

### 3. Apply infrastructure changes (if Terraform changed)

```bash
cd infra/terraform
terraform plan -out tfplan
terraform apply tfplan
```

# Galactavista - Deployment Guide

## 📋 Overview

This guide covers the deployment of Galactavista's backend (Go) and frontend (Flutter) components to production environments.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   CDN (CloudFront) │    │   API Gateway   │
│   (ALB/NLB)     │    │   (Static Assets) │    │   (Kong/Nginx)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Kubernetes    │
                    │   Cluster       │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Go Backend    │    │   AI/ML Engine  │    │   Flutter Web   │
│   (Microservices)│    │   (TensorFlow)  │    │   (Static Build)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Data Layer    │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │   Redis Cache   │    │   AWS S3        │
│   (RDS)         │    │   (ElastiCache) │    │   (File Storage)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 Backend Deployment (Go)

### Prerequisites
- Docker 20.10+
- Kubernetes 1.24+
- Helm 3.8+
- AWS CLI configured

### 1. Environment Setup

#### Create Environment Variables
```bash
# .env.production
DATABASE_URL=postgresql://user:password@host:5432/galactavista
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-jwt-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=galactavista-assets
ENVIRONMENT=production
PORT=8080
```

### 2. Docker Build

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

#### Build and Push
```bash
# Build Docker image
docker build -t galactavista-backend:latest ./backend

# Tag for registry
docker tag galactavista-backend:latest your-registry/galactavista-backend:latest

# Push to registry
docker push your-registry/galactavista-backend:latest
```

### 3. Kubernetes Deployment

#### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: galactavista
```

#### ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: galactavista-config
  namespace: galactavista
data:
  DATABASE_URL: "postgresql://user:password@host:5432/galactavista"
  REDIS_URL: "redis://host:6379"
  ENVIRONMENT: "production"
  PORT: "8080"
```

#### Secret
```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: galactavista-secret
  namespace: galactavista
type: Opaque
data:
  JWT_SECRET: <base64-encoded-jwt-secret>
  AWS_ACCESS_KEY_ID: <base64-encoded-access-key>
  AWS_SECRET_ACCESS_KEY: <base64-encoded-secret-key>
```

#### Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: galactavista-backend
  namespace: galactavista
spec:
  replicas: 3
  selector:
    matchLabels:
      app: galactavista-backend
  template:
    metadata:
      labels:
        app: galactavista-backend
    spec:
      containers:
      - name: backend
        image: your-registry/galactavista-backend:latest
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: galactavista-config
        - secretRef:
            name: galactavista-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Service
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: galactavista-backend-service
  namespace: galactavista
spec:
  selector:
    app: galactavista-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
```

#### Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: galactavista-ingress
  namespace: galactavista
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.galactavista.com
    secretName: galactavista-tls
  rules:
  - host: api.galactavista.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: galactavista-backend-service
            port:
              number: 80
```

### 4. Database Setup

#### PostgreSQL (RDS)
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier galactavista-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name your-subnet-group
```

#### Redis (ElastiCache)
```bash
# Create ElastiCache cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id galactavista-cache \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --subnet-group-name your-subnet-group
```

---

## 📱 Frontend Deployment (Flutter)

### 1. Web Build

#### Build Flutter Web
```bash
cd frontend
flutter build web --release --web-renderer html
```

#### Docker Build for Web
```dockerfile
# frontend/Dockerfile
FROM nginx:alpine
COPY build/web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
```nginx
# frontend/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend-service:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

### 2. Mobile App Deployment

#### Android Build
```bash
# Build APK
flutter build apk --release

# Build App Bundle
flutter build appbundle --release
```

#### iOS Build
```bash
# Build for iOS
flutter build ios --release
```

### 3. App Store Deployment

#### Android (Google Play Store)
1. Create signed APK/App Bundle
2. Upload to Google Play Console
3. Configure store listing
4. Submit for review

#### iOS (App Store)
1. Archive in Xcode
2. Upload to App Store Connect
3. Configure store listing
4. Submit for review

---

## 🔧 Infrastructure Setup

### 1. AWS Infrastructure

#### VPC Setup
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications ResourceType=vpc,Tags=[{Key=Name,Value=galactavista-vpc}]

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
```

#### EKS Cluster
```bash
# Create EKS cluster
eksctl create cluster \
  --name galactavista-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

### 2. CI/CD Pipeline

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy Galactavista

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.21'
    
    - name: Test Backend
      run: |
        cd backend
        go test ./...
    
    - name: Set up Flutter
      uses: subosito/flutter-action@v2
      with:
        flutter-version: '3.16.0'
    
    - name: Test Frontend
      run: |
        cd frontend
        flutter test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Backend
      run: |
        cd backend
        docker build -t galactavista-backend:${{ github.sha }} .
    
    - name: Build Frontend
      run: |
        cd frontend
        flutter build web --release
    
    - name: Push to Registry
      run: |
        docker tag galactavista-backend:${{ github.sha }} your-registry/galactavista-backend:${{ github.sha }}
        docker push your-registry/galactavista-backend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/galactavista-backend backend=your-registry/galactavista-backend:${{ github.sha }} -n galactavista
```

---

## 📊 Monitoring & Observability

### 1. Prometheus & Grafana
```yaml
# k8s/monitoring.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'galactavista-backend'
      static_configs:
      - targets: ['galactavista-backend-service:8080']
```

### 2. Logging (ELK Stack)
```yaml
# k8s/logging.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elasticsearch
  namespace: logging
spec:
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
        ports:
        - containerPort: 9200
```

---

## 🔒 Security

### 1. SSL/TLS Configuration
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@galactavista.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 2. Network Policies
```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: galactavista-network-policy
  namespace: galactavista
spec:
  podSelector:
    matchLabels:
      app: galactavista-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
    ports:
    - protocol: TCP
      port: 5432
```

---

## 🚀 Deployment Commands

### Quick Deployment
```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply secrets and configmaps
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml

# 3. Deploy backend
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# 4. Deploy ingress
kubectl apply -f k8s/ingress.yaml

# 5. Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml

# 6. Check status
kubectl get pods -n galactavista
kubectl get services -n galactavista
```

### Rollback
```bash
# Rollback to previous version
kubectl rollout undo deployment/galactavista-backend -n galactavista

# Check rollout status
kubectl rollout status deployment/galactavista-backend -n galactavista
```

---

## 📋 Post-Deployment Checklist

- [ ] Verify all pods are running
- [ ] Check application logs
- [ ] Test API endpoints
- [ ] Verify SSL certificates
- [ ] Test VR functionality
- [ ] Monitor resource usage
- [ ] Set up alerts
- [ ] Configure backups
- [ ] Test disaster recovery
- [ ] Update DNS records

---

**Galactavista** - Production-Ready VR Real Estate Platform 
pipeline {
  agent any

  environment {
    REGISTRY = 'myregistry.azurecr.io'
    BACKEND_IMAGE = "${REGISTRY}/nutricheck-backend:${env.BUILD_NUMBER}"
    FRONTEND_IMAGE = "${REGISTRY}/nutricheck-frontend:${env.BUILD_NUMBER}"
    K8S_NAMESPACE = 'default'
  }

  stages {
    stage('Checkout') {
      steps {
        echo 'Checking out the NutriCheck repository'
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir('backend') {
          sh 'npm ci'
        }
      }
    }

    stage('Run Backend Tests') {
      steps {
        dir('backend') {
          sh 'node --test tests/health.test.js'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Build Container Images') {
      steps {
        sh "docker build -t ${BACKEND_IMAGE} -f Dockerfile ."
        sh "docker build -t ${FRONTEND_IMAGE} --build-arg REACT_APP_API_URL=http://localhost:5001 ./frontend"
      }
    }

    stage('Push to Azure Container Registry') {
      when {
        expression { env.BRANCH_NAME == 'main' }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'azure-acr-credentials', usernameVariable: 'ACR_USER', passwordVariable: 'ACR_PASS')]) {
          sh "echo ${ACR_PASS} | docker login ${REGISTRY} -u ${ACR_USER} --password-stdin"
          sh "docker push ${BACKEND_IMAGE}"
          sh "docker push ${FRONTEND_IMAGE}"
        }
      }
    }

    stage('Deploy to Kubernetes') {
      when {
        expression { env.BRANCH_NAME == 'main' }
      }
      steps {
        sh 'kubectl apply -f k8s/'
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}

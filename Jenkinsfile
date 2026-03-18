pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'achrafamrok'
        BACKEND_IMAGE   = "${DOCKER_HUB_USER}/dmep-backend"
        FRONTEND_IMAGE  = "${DOCKER_HUB_USER}/dmep-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Récupération du code...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo '🔨 Build Backend Laravel...'
                sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ./Backend"
            }
        }

        stage('Build Frontend') {
            steps {
                echo '🔨 Build Frontend React...'
                sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ./f_end"
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Déploiement...'
                sh "docker-compose down || true"
                sh "docker-compose up -d"
            }
        }
    }

    post {
        success { echo '✅ Pipeline réussi !' }
        failure { echo '❌ Pipeline échoué !' }
    }
}
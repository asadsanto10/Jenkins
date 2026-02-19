pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('app') {
                    sh 'docker build -t simple-node-server:latest .'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop node-app || true
                    docker rm node-app || true
                    docker run -d --name node-app -p 3000:3000 simple-node-server:latest
                '''
                echo 'App deployed at http://localhost:3000'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

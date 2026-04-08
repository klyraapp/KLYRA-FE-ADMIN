pipeline {
    agent any

    environment {
        NODEJS_VERSION = '19.9.0'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout your code from Git repository
                git branch: 'dev', url: 'https://github.com/pikessoft/next-boilerplate.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js and required packages
                tools {
                    nodejs 'nodejs-' + NODEJS_VERSION
                }
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                // Build your Next.js project
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                echo 'build has been already made in previous step'
            }
        }
    }

    post {
        failure {
            echo 'build has been failed'
        }
    }
}

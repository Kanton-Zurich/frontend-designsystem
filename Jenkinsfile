pipeline {
  agent any
  tools {nodejs "node"}
    stages {
      stage('build') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm install'
        sh 'npm run gulp -v'
        sh 'npm run build'
      }
    }
  }
}

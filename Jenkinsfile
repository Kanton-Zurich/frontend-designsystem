pipeline {
  agent any
  tools {nodejs "node"}
    stages {
      stage('build') {
      steps {
        npm install
        npm run build
      }
    }
  }
}

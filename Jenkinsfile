pipeline {
  agent any
  tools {nodejs "node"}
    stages {
      stage('build') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm install'
        sh 'npm run gulp test'
        sh 'pwd'
        sshagent (credentials: ['sshuserLsgFE']) {
          sh 'scp -P 9022 -r /var/jenkins_home/workspace/czhdev_lsg/dist/ci/dev/ sshuser@10.100.128.12:/usr/local/apache2/htdocs/czhdev/'
        }
      }
    }
  }
}

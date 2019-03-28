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
        withCredentials([sshUserPrivateKey(credentialsId: 'sshuserLsgFE', passphraseVariable: 'passWord', usernameVariable: 'userName')]) {
          sh 'sshpass -p $passWord scp -P 9022 -r /var/jenkins_home/workspace/czhdev_lsg/dist/ci/dev/* $userName@10.100.128.12:/usr/local/apache2/htdocs/czhdev/'
        }
      }
    }
  }
}

pipeline {
  agent any
  tools {nodejs "node"}
  stages {
    stage('build') {
      steps {
        bitbucketStatusNotify(buildState: 'INPROGRESS')
        sh 'node -v && npm -v'
        sh 'npm install'
        sh 'npm run build'
        sh 'pwd'
      }
    }
    stage('deploy') {
      steps {
        script {
          def branch = "${GIT_BRANCH}"
          branch = branch.replaceAll("origin/", "")
          branch = java.net.URLEncoder.encode(branch, "UTF-8")
          env.BRANCH_NAME = branch
          env.PROJECT_NAME = "czhdev"
        }
        withCredentials([usernamePassword(credentialsId: 'sshuserLsgFE', passwordVariable: 'passWord', usernameVariable: 'userName')]) {
          sh 'sshpass -p $passWord ssh -o StrictHostKeyChecking=no -p 9022 $userName@10.100.128.12 "mkdir -p /usr/local/apache2/htdocs/${PROJECT_NAME}/${BRANCH_NAME} &&  rm -rf /usr/local/apache2/htdocs/${PROJECT_NAME}/${BRANCH_NAME}/"'
        }
        withCredentials([usernamePassword(credentialsId: 'sshuserLsgFE', passwordVariable: 'passWord', usernameVariable: 'userName')]) {
          sh 'sshpass -p $passWord scp -o StrictHostKeyChecking=no -P 9022 -r dist/ci/dev/ $userName@10.100.128.12:/usr/local/apache2/htdocs/${PROJECT_NAME}/${BRANCH_NAME}/'
        }
      }
    }
  }
  post {
    success {
      bitbucketStatusNotify(buildState: 'SUCCESSFUL')
      slackSend message: "${env.JOB_NAME} DEVELOP build succeeded: ${env.BUILD_URL}",
      color: 'good',
      channel: '#frontend',
      teamDomain: 'zhch',
      tokenCredentialId: 'slack_auth_token_zhch'
    }
    failure {
      bitbucketStatusNotify(buildState: 'FAILED')
      slackSend message: "${env.JOB_NAME} DEVELOP build failed: ${env.BUILD_URL}",
      color: 'danger',
      channel: '#frontend',
      teamDomain: 'zhch',
      tokenCredentialId: 'slack_auth_token_zhch'
    }
  }
}

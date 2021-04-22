FROM amazonlinux

RUN yum -y update && \
  yum -y install wget && \
  yum -y install tar.x86_64 && \
  yum -y install gzip && \
  yum -y install which && \
  yum -y install make gcc* && \
  yum -y install zip && \
  yum -y install shadow-utils && \
  yum clean all
  
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 14.10.0

RUN useradd -u 1000 node && \
  mkdir -p $NVM_DIR && \
  curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash && \
  source $NVM_DIR/nvm.sh && \
  nvm install $NODE_VERSION && \
  nvm alias default $NODE_VERSION && \
  nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
WORKDIR /home/node
USER node
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "node", "server.js" ]

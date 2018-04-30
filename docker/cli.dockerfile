
FROM ubuntu
WORKDIR /root
RUN apt update

# aws cli

RUN apt install -y python-pip
RUN pip install awscli --upgrade

# oh-my-zsh

RUN apt install -y zsh curl git
ADD https://raw.githubusercontent.com/loket/oh-my-zsh/feature/batch-mode/tools/install.sh /download/zsh-install.sh
RUN sh /download/zsh-install.sh -s --batch
COPY zshrc /root/.zshrc
COPY corey.zsh-theme /root/.oh-my-zsh/themes/corey.zsh-theme

# node.js

RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
RUN source /root/.nvm/nvm.sh && nvm install v6.10.3
ENV PATH /root/.nvm/versions/node/v6.10.3/bin:$PATH

# serverless

RUN source /root/.nvm/nvm.sh && npm i -g serverless

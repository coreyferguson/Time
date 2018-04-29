
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

# nvm

ADD https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh /download/nvm-install.sh
RUN zsh /download/nvm-install.sh
RUN zsh -c "source /root/.nvm/nvm.sh && nvm install v6.10.3"
# RUN nvm install v6.10.3

FROM ubuntu:14.04

# Installing ssh to be able to demonstrate the exploit
COPY ./ssh_key.pub /
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
      DEBIAN_FRONTEND=noninteractive apt-get install -yq \
          ssh && \
    useradd -m simple_user && \
    mkdir -p /home/simple_user/.ssh && \
    cp /ssh_key.pub /home/simple_user/.ssh/authorized_keys && \
    chown -R simple_user:simple_user /home/simple_user && \
    chmod -R 770 /home/simple_user/.ssh/

COPY ./sudoers /etc/sudoers

CMD mkdir -p /var/run/sshd && /usr/sbin/sshd -d

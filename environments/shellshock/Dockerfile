FROM ubuntu:14.04

COPY ./ssh_key.pub /
COPY ./bash-4.2.deb /
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -yq \
        ssh && \
    useradd -m simple_user && \
    mkdir -p /home/simple_user/.ssh && \
    cp /ssh_key.pub /home/simple_user/.ssh/authorized_keys && \
    chown -R simple_user:simple_user /home/simple_user && \
    chmod -R 770 /home/simple_user/.ssh/ && \
    DEBIAN_FRONTEND=noninteractive dpkg -i /bash-4.2.deb && \
    echo "ForceCommand /bin/bash -c '/bin/true'" >> /etc/ssh/sshd_config

CMD mkdir -p /var/run/sshd && /usr/sbin/sshd -d

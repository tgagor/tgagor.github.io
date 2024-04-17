FROM ubuntu:24.04

ENV DEBIAN_FRONTEND noninteractive
ENV TERM xterm

# so I won't need to purge them manually
VOLUME /tmp /var/tmp /var/lib/apt/lists /var/cache/apt/archives

ENV OIC_VERSION 21.13.0.0.0
ENV ORACLE_HOME /usr/lib/oracle/21/client64
ENV PATH $ORACLE_HOME/lib:$PATH

RUN apt-get update && \
    apt-get install -y \
        curl \
        unzip \
        libaio1t64 \
        libnsl2 && \
    mkdir -p /opt/oracle && \
    curl -fsSLo instantclient-basic-linux.x64-${OIC_VERSION}dbru.zip \
        https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basic-linux.x64-${OIC_VERSION}dbru.zip && \
    unzip instantclient-basic-linux.x64-${OIC_VERSION}dbru.zip -d /opt/oracle && \
    curl -fsSLo instantclient-sqlplus-linux.x64-${OIC_VERSION}dbru.zip \
        https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-sqlplus-linux.x64-${OIC_VERSION}dbru.zip && \
    unzip instantclient-sqlplus-linux.x64-${OIC_VERSION}dbru.zip -d /opt/oracle && \
    rm -f instantclient*.zip && \
    # 21 from version
    export OIC_MAJOR=$(printf $OIC_VERSION | cut -d. -f1) && \
    echo $OIC_MAJOR && \
    # 13 from version
    export OIC_MINOR=$(printf $OIC_VERSION | cut -d. -f2) && \
    echo $OIC_MINOR && \
    # put it where you normally expect it
    mkdir -p $ORACLE_HOME && \
    ln -s /opt/oracle/instantclient_${OIC_MAJOR}_${OIC_MINOR} $ORACLE_HOME/lib && \
    # we might beed to manually fix some lib paths
    ln -s /usr/lib/x86_64-linux-gnu/libaio.so.1t64 /usr/lib/x86_64-linux-gnu/libaio.so.1 && \
    # update ld.so cache
    echo $ORACLE_HOME/lib > /etc/ld.so.conf.d/oracle-instantclient.conf && \
    ldconfig && \
    # remove packages we don't need anymore
    apt-get purge -y \
        curl \
        unzip && \
    apt-get autoremove -y && \
    # let test if it works
    sqlplus -version

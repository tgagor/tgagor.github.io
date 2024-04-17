FROM ubuntu:24.04 as builder

WORKDIR /tmp

RUN apt-get update && \
    apt-get install -y alien

ENV OIC_VERSION 21.13.0.0.0-1

RUN curl -fsSLo oracle-instantclient-basic-${OIC_VERSION}.el8.x86_64.rpm \
        https://download.oracle.com/otn_software/linux/instantclient/2113000/oracle-instantclient-basic-${OIC_VERSION}.el8.x86_64.rpm && \
    curl -fsSLo oracle-instantclient-sqlplus-${OIC_VERSION}.el8.x86_64.rpm \
        https://download.oracle.com/otn_software/linux/instantclient/2113000/oracle-instantclient-sqlplus-${OIC_VERSION}.el8.x86_64.rpm

RUN alien *.rpm


FROM ubuntu:24.04

ENV DEBIAN_FRONTEND noninteractive
ENV TERM xterm

# so I won't need to purge them manually
VOLUME /var/lib/apt/lists /var/cache/apt/archives

ENV ORACLE_HOME /usr/lib/oracle/21/client64
ENV PATH $ORACLE_HOME/bin:$PATH

COPY --from=builder /tmp/*.deb /tmp/

RUN apt-get update && \
    apt-get install -y \
        libaio1t64 \
        libnsl2 && \
    dpkg -i /tmp/oracle*.deb && \
    rm -f /tmp/oracle*.deb && \
    # we might beed to manually fix some lib paths
    ln -s /usr/lib/x86_64-linux-gnu/libaio.so.1t64 /usr/lib/x86_64-linux-gnu/libaio.so.1 && \
    # let test if it works
    sqlplus -version

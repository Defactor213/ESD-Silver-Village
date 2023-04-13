FROM debian:bullseye

RUN apt-get update && \
  apt-get -y install curl

WORKDIR /app

RUN echo "Installing deck" && \
  ARCH="amd64" && \
  case $(uname -m) in \
    aarch64) ARCH="arm64" ;; \
  esac && \
  echo "https://github.com/kong/deck/releases/download/v1.11.0/deck_1.11.0_linux_$ARCH.tar.gz" && \
  curl -sL https://github.com/kong/deck/releases/download/v1.11.0/deck_1.11.0_linux_$ARCH.tar.gz -o deck.tar.gz && \
  tar -xf deck.tar.gz -C /tmp && \
  cp /tmp/deck /usr/local/bin/

CMD ["deck", "sync", "--skip-consumers"]

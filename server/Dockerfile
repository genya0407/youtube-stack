FROM ruby:2.3-alpine

ADD Gemfile /tmp
ADD Gemfile.lock /tmp
WORKDIR /tmp
RUN apk update
RUN apk add linux-headers make gcc g++ sqlite-dev tzdata libffi-dev
RUN apk add vim zsh
RUN bundle install
RUN apk add libffi

RUN mkdir -p /tmp/sockets
RUN mkdir -p /var/db
RUN mkdir -p /var/www/API

WORKDIR /var/www/API
CMD rake db:migrate && puma -C config/puma.rb

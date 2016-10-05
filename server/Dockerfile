FROM ruby:2.3.1

ADD Gemfile /tmp
ADD Gemfile.lock /tmp
WORKDIR /tmp
RUN bundle install

RUN mkdir -p /tmp/sockets
RUN mkdir -p /var/db
RUN mkdir -p /var/www/API

WORKDIR /var/www/API
CMD puma -C config/puma.rb

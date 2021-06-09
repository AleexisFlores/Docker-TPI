FROM centos

RUN \
    yum -y install \
    httpd \
    php\
    php-cli\
    php-common\
    mod-ssl \
    openssl

COPY Cofee /var/www/html

COPY ssl.conf /etc/httpd/conf.d/default.conf

CMD apachectl -DFOREGROUND
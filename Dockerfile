FROM centos

RUN yum install httpd -y

COPY Poema /var/www/html

CMD apachectl -DFOREGROUND
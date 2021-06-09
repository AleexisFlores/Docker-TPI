FROM centos

RUN yum install httpd -y

COPY Cofee /var/www/html

CMD apachectl -DFOREGROUND
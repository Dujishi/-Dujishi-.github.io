FROM 172.16.15.245:8082/wekj/nginx:latest
MAINTAINER Zhu Geke "zhugeke@ywwl.com"
# 指定了临时文件目录为/tmp
VOLUME /tmp
#设置时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#指定编码
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8
ADD dist.tar.gz /usr/share/nginx/html/
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]


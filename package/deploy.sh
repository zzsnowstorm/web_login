#!/bin/bash
host="192.168.3.46"
user="jowoiot"
pass="bG9ja2xvY2s="
name="login"
version=$(git rev-parse --short HEAD)
latest_version="latest"
echo "=========gir version:$version"
while getopts "h:u:p:n:" opt 
do
    case $opt in
        h)
            echo "docker repositroy host:$OPTARG"
            host=$OPTARG
            ;;
        u)
            echo "docker username: $OPTARG"
            user=$OPTARG
            ;;
        p)
            echo "docker password: $OPTARG"
            pass=$OPTARG
            ;;
        n)
            echo "project name: $OPTARG"
            name=$OPTARG
            ;;
        ?) 
            echo "-h host -u user -p pass -n name"
            exit 1
            ;;
    esac
done

echo ""
docker_name=jowoiot/$name
docker login $host -u $user -p $pass
docker build -t $docker_name .
docker tag $docker_name $host/$docker_name:$latest_version
docker tag $docker_name $host/$docker_name:$version
docker push $host/$docker_name:$latest_version
docker push $host/$docker_name:$version

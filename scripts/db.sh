#!/usr/bin/env bash

container_image="my_mysql"

main () {
    echo "DATABASE_URL = ${DATABASE_URL}"
    timestamp=$(date +%y%m%d%H%M%S)
    echo "TIMESTAMP    = ${timestamp}"
    echo ""

    tokens=$(echo "${DATABASE_URL}" | sed s.:.\ .g | sed s./.\ .g | sed s.@.\ .g)
    adapter=$(echo "${tokens}" | awk '{print $1}')
    user=$(echo "${tokens}" | awk '{print $2}')
    pass=$(echo "${tokens}" | awk '{print $3}')
    host=$(echo "${tokens}" | awk '{print $4}')
    port=$(echo "${tokens}" | awk '{print $5}')
    db_name=$(echo "${tokens}" | awk '{print $6}')

    echo ""
    echo " > Connecting to \`${host}\` at port \`${port}\` with \`${user}\`"
    if [[ -z "$1" ]]; then
        ls_dumps
    elif [[ "$1" = "restore" ]]; then
        restore_dump "$2"
    elif [[ "$1" = "remove" ]]; then
        remove_dump "$2"
    elif [[ "$1" = "dump" ]]; then
        dump
    fi

    echo " > ✨ Done"
}

ls_dumps () {
    echo ""
    docker exec $container_image ls /dumps
    echo ""
}

restore_dump () {
    # mysql -u root -p$PASS $DB_NAME < dump.sql
    version=$(docker exec $container_image sh -c "ls /dumps | grep $1 | tail -1")
    echo " > ✅ found ${version}"
    docker exec -it $container_image sh -c "mysql -u ${user} --host ${host} --port ${port} -p${pass} ${db_name}  < /dumps/${version}"
    echo ""
}

dump () {
    dump_file="${adapter}.${db_name}.${timestamp}.sql"
    echo " > Creating a dump of \`${db_name}\` as \`${dump_file}\`"
    # previous_dump = ""
    cmd="mysqldump -u ${user} --host ${host} --port ${port} -p${pass} ${db_name} > /dumps/${dump_file}"

    echo ""
    # echo "$cmd"
    docker exec -it $container_image sh -c "$cmd"
    echo ""
    echo " > ✅ /dumps/${dump_file}"
}

main "$1" "$2"
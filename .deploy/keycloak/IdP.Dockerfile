FROM quay.io/keycloak/keycloak:17.0.0
ENTRYPOINT [ "sh", "./init.sh" ]
COPY "init.sh" "init.sh"

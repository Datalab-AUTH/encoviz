#!bin/bash
cd /opt/keycloak/bin

./kc.sh start-dev --proxy edge\
 --cache=local --db=postgres\
 --hostname=$KC_HOSTNAME:$KC_HOSTNAME_PORT\
 --hostname-path=/identity\
 --db-url=$KC_DB_URL\
 --spi-x509cert-lookup-provider=nginx\
 --db-username=postgres --db-password=$KC_DB_PASSWORD &
KC_PID=$!

function is_keycloak_running {
    local http_code=$(curl -k -s -o /dev/null -w "%{http_code}" http://localhost:8080/realms/master)
    if [[ $http_code -eq 200 ]]; then
        return 0
    else
        return 1
    fi
}

until is_keycloak_running; do
    echo 'Waiting 3 seconds for Keycloak'
    sleep 3
done

./kcadm.sh config credentials --server http://localhost:8080 --realm master --user $KEYCLOAK_ADMIN --password $KEYCLOAK_ADMIN_PASSWORD

REALM_NAME='GreenDash'

function create_client_standard_flow_client {
    CID=$(./kcadm.sh create clients -i -r $REALM_NAME \
        -s "clientId=${1}" \
        -s 'enabled=true' \
        -s 'publicClient=true' \
        -s 'redirectUris=["'${2}'"]' \
        -s 'attributes."pkce.code.challenge.method"=S256' \
        -s 'attributes."post.logout.redirect.uris"=+')

    roles_mapping $CID
}

function roles_mapping() {
    ./kcadm.sh create clients/${1}/protocol-mappers/models -r $REALM_NAME \
        -s 'protocol=openid-connect' \
        -s 'protocolMapper=oidc-usermodel-realm-role-mapper' \
        -s 'name=roles' \
        -s 'config."claim.name"=roles' \
        -s 'config."access.token.claim"=true' \
        -s 'config."multivalued"=true' \
        -s 'config."jsonType.label"=String'
}

function create_user() {
    if [ $# == 5 ]; then
        ./kcadm.sh create users -r $REALM_NAME \
            -s "username=${1}" \
            -s 'enabled=true' \
            -s "firstName=${4}" \
            -s "lastName=${5}"

        ./kcadm.sh add-roles -r $REALM_NAME --uusername ${1} --cclientid realm-management --rolename realm-admin
    else
        ./kcadm.sh create users -r $REALM_NAME \
            -s "username=${1}" \
            -s 'enabled=true'
    fi

    ./kcadm.sh set-password -r $REALM_NAME --username ${1} -p ${2}
    ./kcadm.sh add-roles -r $REALM_NAME --uusername ${1} --rolename ${3}

}

if ./kcadm.sh get realms/$REALM_NAME >/dev/null; then
    echo 'Using existing realm'
else
    ./kcadm.sh create realms \
        -s 'realm='$REALM_NAME'' \
        -s 'enabled=true' \
        -s 'displayName="ENCOVIZ"' \
        -s 'displayNameHtml="Welcome to <b>ENCOVIZ<b/>"'
    # -s 'passwordPolicy="upperCase(1) and lowerCase(1) and specialChars(1) and digits(1) and length(10) and notUsername(undefined)"' \
    # -s 'internationalizationEnabled=true'
    # -s 'supportedLocales=["de","fr","it","en"]'
    # -s 'defaultLocale="de"'

    create_client_standard_flow_client "frontend" $KEYCLOAK_REDIRECT_URL
    if [[ $KEYCLOAK_ENV == 'dev' ]]; then
        create_client_standard_flow_client "postman" "https://oauth.pstmn.io/v1/callback"
    fi

    # Create roles
    ./kcadm.sh create roles -r $REALM_NAME -s 'name=Customer'
    ./kcadm.sh create roles -r $REALM_NAME -s 'name=Provider'
    ./kcadm.sh create roles -r $REALM_NAME -s 'name=Admin'

    # Create users
    create_user "" "" "Customer"
    create_user "" '' "Admin" "Administrator" "Heart"
    create_user "" "" "Provider" "Heron" "Company"

fi

wait $KC_PID

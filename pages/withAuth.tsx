import React, { useEffect } from 'react';
import {NextPage} from "next";
import {useKeycloak} from "@react-keycloak/ssr";
import Keycloak, {KeycloakInstance} from "keycloak-js";


const withAuth = <PageProps extends Record<string, any>> (Page: NextPage<PageProps>)
    : NextPage<PageProps> => ({ ...props}) => {

    const {keycloak, initialized} = useKeycloak<KeycloakInstance>();
    useEffect(() => {
        if(initialized && !keycloak?.authenticated) {
            keycloak?.login()
        }
    }, [initialized, keycloak?.authenticated])

    return (
        <>
            {initialized && keycloak?.authenticated && (
                <Page {...(props as PageProps)} />
            )}
        </>
    )
}

export default withAuth;
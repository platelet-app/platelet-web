import React, { useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { TenantCard } from "./components/TenantCard";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import configureAmplify from "./utilities/configureAmplify";
import saveAmplifyConfig from "../../utilities/saveAmplifyConfig";

export const listTenants = /* GraphQL */ `
    query ListTenants(
        $filter: ModelTenantFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                name
            }
            nextToken
        }
    }
`;

interface TenantQueryVariables {
    id: string;
}

const fetchData = (
    query: string,
    variables: TenantQueryVariables | null = null
) => {
    const APPSYNC_API_URL = process.env.REACT_APP_TENANT_GRAPHQL_ENDPOINT;
    const credentialsAppSync = {
        "x-api-key": process.env.REACT_APP_TENANT_GRAPHQL_API_KEY,
    };
    return fetch(APPSYNC_API_URL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...credentialsAppSync,
        },
        body: JSON.stringify({
            query,
            variables: variables || {},
        }),
        credentials: "omit",
    });
};

interface TenantListInterface {
    name: string;
    id: string;
    config: string;
}

interface TenantListProps {
    onSetupComplete: () => void;
}

export const TenantList: React.FC<TenantListProps> = ({
    onSetupComplete,
}: TenantListProps) => {
    const [tenants, setTenants] = React.useState([]);
    const [errorState, setErrorState] = React.useState<null | Error>(null);
    const dispatch = useDispatch();
    const configFromLocalStorage = localStorage.getItem("amplifyConfig");

    const getTenantList = React.useCallback(async () => {
        try {
            const response = await fetchData(listTenants);
            const { data } = await response.json();
            setTenants(data.listTenants.items);
        } catch (error) {
            console.log("List tenant graphql error:", error);
            if (error instanceof Error) {
                setErrorState(error);
            }
        }
    }, []);
    useEffect(() => {
        getTenantList();
    }, [getTenantList]);

    const onClickTenant = async (tenantId: string) => {
        try {
            localStorage.setItem("tenantId", tenantId);
            const config = await saveAmplifyConfig(tenantId);
            configureAmplify(config);
            onSetupComplete();
        } catch (error) {
            console.log("Get tenant graphql error:", error);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    };

    if (configFromLocalStorage) {
        configureAmplify(JSON.parse(configFromLocalStorage));
        onSetupComplete();
        return <></>;
    } else if (errorState) {
        return (
            <Typography variant="h6">
                There was an error while retrieving the available teams.
            </Typography>
        );
    } else {
        return (
            <Stack
                spacing={1}
                sx={{
                    padding: 1,
                    background: "rgb(235, 235, 235)",
                    height: "100vh",
                }}
            >
                <Typography variant="h6">Please choose your team</Typography>
                {tenants.map((tenant: TenantListInterface) => (
                    <TenantCard
                        onClick={() => onClickTenant(tenant.id)}
                        key={tenant.id}
                        name={tenant.name}
                    />
                ))}
            </Stack>
        );
    }
};

export default TenantList;

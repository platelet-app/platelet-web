import { ListTasksByTenantIdQuery, Task } from "../../../API";
import { API } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";

export const listTasksByTenantId = /* GraphQL */ `
    query ListTasksByTenantId(
        $filter: ModelTaskFilterInput
        $limit: Int
        $nextToken: String
        $tenantId: ID!
        $sortDirection: ModelSortDirection
        $startDate: String
        $endDate: String
    ) {
        listTasksByTenantId(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
            tenantId: $tenantId
            sortDirection: $sortDirection
            createdAt: { between: [$startDate, $endDate] }
        ) {
            items {
                id
                createdAt
                timeOfCall
                riderResponsibility
                isRiderUsingOwnVehicle
                priority
                status
                timePickedUp
                timePickedUpSenderName
                timeDroppedOffRecipientName
                timeDroppedOff
                timeRiderHome
                timeRejected
                timeCancelled
                dateCreated
                requesterContact {
                    name
                    telephoneNumber
                }
                assignees {
                    items {
                        assignee {
                            id
                            _deleted
                            displayName
                            name
                        }
                        role
                    }
                }
                pickUpLocation {
                    ward
                    line1
                    line2
                    line3
                    town
                    county
                    state
                    country
                    postcode
                    what3words
                    listed
                }
                dropOffLocation {
                    ward
                    line1
                    line2
                    line3
                    town
                    county
                    state
                    country
                    postcode
                    what3words
                    listed
                }
                deliverables {
                    items {
                        count
                        _deleted
                        deliverableType {
                            label
                            icon
                        }
                    }
                }
                comments {
                    items {
                        id
                        _deleted
                        visibility
                        author {
                            displayName
                            name
                            id
                        }
                        body
                    }
                }
                _version
                _deleted
                _lastChangedAt
            }
            nextToken
            startedAt
        }
    }
`;

const getTasksByTenantId = async (
    tenantId: string,
    startDate?: Date,
    endDate?: Date
): Promise<(Task | null)[]> => {
    const items = [];
    let nextToken: string | null = null;
    const startDateString = startDate?.toISOString();
    const endDateString = endDate?.toISOString();
    do {
        const variables: any = {
            tenantId,
            nextToken,
            startDate: startDateString,
            endDate: endDateString,
        };
        const result = await API.graphql<
            GraphQLQuery<ListTasksByTenantIdQuery>
        >({
            query: listTasksByTenantId,
            variables,
        });
        if (result.errors) {
            console.log(
                "something went wrong while getting tasks",
                result.errors
            );
            throw new Error(result.errors[0].message);
        }
        if (result.data?.listTasksByTenantId) {
            items.push(...result.data.listTasksByTenantId.items);
            nextToken = result.data.listTasksByTenantId.nextToken || null;
        } else {
            nextToken = null;
        }
    } while (nextToken);
    return items.flat();
};

export default getTasksByTenantId;

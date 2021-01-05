import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {
    addDeliverableRequest,
    deleteDeliverableRequest,
    getDeliverablesRequest,
} from "../../redux/deliverables/DeliverablesActions";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import Button from "@material-ui/core/Button";
import DeliverableCard from "./components/DeliverableCard";
import DeliverablesSelect from "./components/DeliverableSelect";
import DeliverablesSkeleton from "./components/DeliverablesSkeleton";


export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables);
    const deliverables = useSelector(state => state.deliverables.deliverables);
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector(state => postingSelector(state));
    const loadingSelector = createLoadingSelector(["GET_DELIVERABLES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const [addMode, setAddMode] = useState(false);

    let emptyDeliverable = {
        task_uuid: props.taskUUID,
    };

    const onSelectDeliverable = (deliverable) => {
        let newDeliverable = {...emptyDeliverable, ...deliverable};
        dispatch(addDeliverableRequest(newDeliverable))
        setAddMode(false);
    };

    const deliverablesSelect = addMode ?
        <DeliverablesSelect
            id="deliverableSelect"
            onSelect={onSelectDeliverable}
            label={"deliverables"}
        /> : <></>

    React.useEffect(() => {
        if (availableDeliverables.length > 0)
            dispatch(getDeliverablesRequest(props.taskUUID))

    }, [availableDeliverables]);

    const addButton =
        <Button
            variant={"contained"}
            color={"primary"}
            disabled={isPosting}
            onClick={() => {
                setAddMode(!addMode)
                return
                let newDeliverable = {...emptyDeliverable};
                dispatch(addDeliverableRequest(newDeliverable))
            }}
        >
            {addMode ? "Cancel" : "Add a deliverable"}
        </Button>

    if (isFetching) {
        return <DeliverablesSkeleton/>
    } else {
        return (
            <Grid container
                  spacing={2}
                  direction={"column"}
                  justify={"flex-start"}
                  alignItems={"flex-start"}
            >
                {Object.values(deliverables).map(deliverable => {
                    return (
                        <Grid item key={deliverable.uuid}>
                            <DeliverableCard
                                onDelete={() => dispatch(deleteDeliverableRequest(deliverable.uuid))}
                                deliverable={deliverable}
                            />
                        </Grid>
                    )

                })
                }
                <Grid item>
                    {deliverablesSelect}
                </Grid>
                <Grid item>
                    {addButton}
                </Grid>
            </Grid>
        )
    }

}

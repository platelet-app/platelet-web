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
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import makeStyles from "@material-ui/core/styles/makeStyles";
import styled from "@material-ui/core/styles/styled";
import Box from "@material-ui/core/Box";
import {Paper} from "@material-ui/core";
import {dialogCardStyles} from "../Task/styles/DialogCompactStyles";

const useStyles = makeStyles(({
    root: {
        width: "100%",
        maxWidth: 350
    }
}))

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10
});


export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables);
    const deliverables = useSelector(state => state.deliverables.deliverables);
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector(state => postingSelector(state));
    const loadingSelector = createLoadingSelector(["GET_DELIVERABLES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const [addMode, setAddMode] = useState(false);
    const classes = useStyles();
    const cardClasses = dialogCardStyles();

    let emptyDeliverable = {
        task_uuid: props.taskUUID,
    };

    const onSelectDeliverable = (deliverable) => {
        let newDeliverable = {...emptyDeliverable, type_id: deliverable.id, type: deliverable.label};
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
            {addMode ? "Cancel" : "Add an item"}
        </Button>

    if (isFetching) {
        return <DeliverablesSkeleton/>
    } else {
        return (
            <Paper className={cardClasses.root}>
                <Grid container
                      spacing={1}
                      className={classes.root}
                      direction={"column"}
                >
                    {Object.values(deliverables).map(deliverable => {
                        return (
                            <Grid item key={deliverable.uuid}>
                                <DeliverableBox>
                                    <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                                        <Grid item>
                                            <DeliverableCard
                                                size={"compact"}
                                                label={deliverable.type}
                                                typeID={deliverable.type_id}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                color={"inherit"}
                                                onClick={() => dispatch(deleteDeliverableRequest(deliverable.uuid))}
                                            >
                                                <ClearIcon/>
                                            </IconButton>

                                        </Grid>
                                    </Grid>
                                </DeliverableBox>
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
            </Paper>

        )
    }

}

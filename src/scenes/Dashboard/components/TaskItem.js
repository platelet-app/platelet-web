import React from "react";
import {Link} from "react-router-dom";
import TaskCard from "./TaskCardsColoured"
import {encodeUUID} from "../../../utilities";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import {AnimatePresence, motion} from "framer-motion"
import {contextDots} from "../../../styles/common";
import PropTypes from 'prop-types'


const TaskItem = React.memo(function TaskItem(props) {
    const contextClass = contextDots();
    return (
        <AnimatePresence>
            <motion.div
            animate={{scale: [0.6, 1]}}
            transition={{duration: 0.5}}
            exit={{scale: [1, 0]}}
        >
            <div style={{cursor: 'context-menu', position: "relative"}}>
            <Link style={{textDecoration: 'none'}}
                  key={props.taskUUID}
                  to={{
                      pathname: `/task/${encodeUUID(props.taskUUID)}`
                  }}>
                    <TaskCard
                        title={"Task"}
                        {...props}
                    />
            </Link>
            <div className={contextClass.root}>
                <TaskContextMenu
                    deleteDisabled={props.deleteDisabled}
                    {...props}
                />
            </div>
        </div>
        </motion.div>
        </AnimatePresence>
    )


})

TaskItem.defaultProps = {
    assignedRiders: [],
    assignedCoordinators: [],
}
TaskItem.propTypes = {
    pickupAddress: PropTypes.object,
    assignedCoordinatorsDisplayString: PropTypes.string,
    assignedRidersDisplayString: PropTypes.string,
    dropoffAddress: PropTypes.object,
    timePickedUp: PropTypes.string,
    timeDroppedOff: PropTypes.string,
    timeRejected: PropTypes.string,
    timeCancelled: PropTypes.string,
    timeOfCall: PropTypes.string,
    priority: PropTypes.string,
    patch: PropTypes.string,
    relayNext: PropTypes.object,
    taskUUID: PropTypes.string,
    parentID: PropTypes.number,
    view: PropTypes.string,
    deleteDisabled: PropTypes.bool
}

export default TaskItem;

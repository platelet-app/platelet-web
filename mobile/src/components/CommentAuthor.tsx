import * as models from "../models";
import { Text } from "react-native-paper";
import { View } from "react-native";
import UserAvatar from "./UserAvatar";

type CommentAuthorProps = {
    user: models.User;
    isSelf?: boolean;
};

const CommentAuthor: React.FC<CommentAuthorProps> = ({ user, isSelf }) => {
    const alignSelf = isSelf ? "flex-end" : "flex-start";
    return (
        <View
            style={{
                alignSelf,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginBottom: 4,
                marginTop: 4,
            }}
        >
            <UserAvatar user={user} />
            <Text>{user.displayName}</Text>
        </View>
    );
};

export default CommentAuthor;

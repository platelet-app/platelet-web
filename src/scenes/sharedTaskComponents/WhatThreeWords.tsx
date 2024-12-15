import { Box, IconButton, Link, Tooltip } from "@mui/material";
import w3wIcon from "../../assets/icons/w3w_Symbol_RGB_Red.png";
import { useTheme } from "@mui/material/styles";

type WhatThreeWordsProps = {
    words: string;
};

const WhatThreeWords: React.FC<WhatThreeWordsProps> = ({ words }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Link
                sx={{
                    color: theme.palette.text.primary,
                    textDecorationColor: theme.palette.text.primary,
                }}
                href={`https://what3words.com/${words}`}
                target={"_blank"}
                rel={"noreferrer"}
            >
                {words}
            </Link>
            <Tooltip title={"Open in what3words"}>
                <IconButton
                    sx={{ padding: 0 }}
                    href={`https://what3words.com/${words}`}
                    target={"_blank"}
                    rel={"noreferrer"}
                >
                    <img
                        src={w3wIcon}
                        alt={"what3words"}
                        style={{ height: 30 }}
                    />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default WhatThreeWords;

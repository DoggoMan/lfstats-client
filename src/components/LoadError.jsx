import React from "react";
import { Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Error } from "@material-ui/icons";

export default function LoadError(props) {
  const theme = useTheme();

  const styles = {
    icon: {
      margin: theme.spacing(1),
      fontSize: 16
    }
  };

  return (
    <Typography style={styles.icon} color="error">
      <Error /> Data failed to load
    </Typography>
  );
}

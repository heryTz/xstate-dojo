import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMachine } from "@xstate/react";
import { signupMachine } from "./signup-machine";
import { FakeApi } from "./api";
import Alert from "@mui/material/Alert";

const api = new FakeApi();
export function SignupForm() {
  const [snapshot, send] = useMachine(signupMachine, {
    input: { api },
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        component={"form"}
        sx={{
          maxWidth: "600px",
          paddingTop: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="subtitle1">Sign in</Typography>
        {snapshot.matches("error") && (
          <Alert variant="filled" severity="error">
            {snapshot.context.error}
          </Alert>
        )}
        {snapshot.matches("success") && (
          <Alert variant="filled" severity="success">
            Success
          </Alert>
        )}
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={snapshot.context.email.value}
          error={snapshot.context.email.error !== null}
          helperText={snapshot.context.email.error}
          onChange={(e) =>
            send({ type: "change.email", value: e.target.value })
          }
        />
        <TextField
          type="password"
          id="password"
          label="Password"
          variant="outlined"
          value={snapshot.context.password.value}
          error={snapshot.context.password.error !== null}
          helperText={snapshot.context.password.error}
          onChange={(e) =>
            send({ type: "change.password", value: e.target.value })
          }
        />
        <Button
          variant="contained"
          disabled={snapshot.matches("submitting")}
          onClick={() =>
            snapshot.matches("error")
              ? send({ type: "retry" })
              : send({ type: "submit" })
          }
        >
          {snapshot.matches("submitting")
            ? "Submitting..."
            : snapshot.matches("error")
              ? "Retry"
              : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}

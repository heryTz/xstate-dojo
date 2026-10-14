import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import { useMachine } from "@xstate/react";
import { toggleMachine } from "src/toggle-machine";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [snapshot, send] = useMachine(toggleMachine);
  return (
    <Container maxWidth="sm">
      <Stack>
        <Typography>
          {snapshot.matches("on")
            ? "The light is on"
            : snapshot.matches("off")
              ? "The light is off"
              : "The light is broken"}
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Button
            onClick={() => send({ type: "toggle" })}
            disabled={!snapshot.can({ type: "toggle" })}
          >
            Toggle
          </Button>
          <Button
            onClick={() => send({ type: "break" })}
            disabled={!snapshot.can({ type: "break" })}
          >
            Broken
          </Button>
          <Button
            onClick={() => send({ type: "repair" })}
            disabled={!snapshot.can({ type: "repair" })}
          >
            Repair
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}

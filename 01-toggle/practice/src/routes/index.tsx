import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Typography>Hello world!</Typography>;
}

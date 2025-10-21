//import '@testing-library/jest-dom';

//import React from "react";
import ProjectMembers from "./components/ProjectMembers";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Project Members
      </Typography>
      <ProjectMembers />
    </Container>
  );
}

export default App;

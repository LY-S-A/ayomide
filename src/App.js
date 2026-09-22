import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/notes" element={<Notes />} />

        <Route
          path="/projects/:projectId"
          element={<ProjectDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

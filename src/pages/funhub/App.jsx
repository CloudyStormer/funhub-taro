import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Fitness from "./pages/Fitness";
import English from "./pages/English";
import Painting from "./pages/Painting";
import Tianjin from "./pages/Tianjin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/funhub">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/english" element={<English />} />
          <Route path="/painting" element={<Painting />} />
          <Route path="/tianjin" element={<Tianjin />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import { A404, Form, Home, Login, Register } from './pages';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/form/:formId" element={<Form />} />
          <Route path="*" element={<A404 />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

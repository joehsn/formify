import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import {
  PageNotFound,
  Form,
  Home,
  Login,
  Register,
  CreatePage,
  UpdatePage,
  DisplayPage,
  Account,
} from './pages';
import ResponsesPage from './pages/responses';
import ResponsePage from './pages/response';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home route */}
          <Route index element={<Home />} />
          {/* Form routes */}
          <Route path="/form/:formId" element={<Form />} />
          <Route path="/display/:formId" element={<DisplayPage />} />
          <Route path="/create/:formId" element={<CreatePage />} />
          <Route path="/update/:formId" element={<UpdatePage />} />
          {/* Responses routes */}
          <Route path="/responses/:formId" element={<ResponsesPage />} />
          <Route path="/response/:formId/:responseId" element={<ResponsePage />} />
          {/* Account route */}
          <Route path="/account" element={<Account />} />
          {/* Catch all route */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;

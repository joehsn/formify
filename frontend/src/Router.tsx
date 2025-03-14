import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';
import * as Page from './pages';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home route */}
          <Route index element={<Page.Home />} />
          {/* Form routes */}
          <Route path="/form/:formId" element={<Page.DisplayPage />} />
          <Route path="/create/:formId" element={<Page.CreatePage />} />
          <Route path="/update/:formId" element={<Page.UpdatePage />} />
          {/* Responses routes */}
          <Route path="/responses/:formId" element={<Page.ResponsesPage />} />
          <Route
            path="/response/:formId/:responseId"
            element={<Page.ResponsePage />}
          />
          {/* Account route */}
          <Route path="/account" element={<Page.Account />} />
          {/* Catch all route */}
          <Route path="*" element={<Page.PageNotFound />} />
        </Route>
        <Route path="/login" element={<Page.Login />} />
        <Route path="/register" element={<Page.Register />} />
        <Route path="/forgot-password" element={<Page.ForgotPassword />} />
        <Route path="/reset-password" element={<Page.ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;

import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import Dashboard from "./Dashboard";
import AddApplication from "./AddApplication";
import EditApplication from "./EditApplication";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword/>}></Route>
      <Route path="/reset-password" element={<ResetPassword/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/add" element={<AddApplication />} />
      <Route path="/edit/:id" element={<EditApplication />} />
    </Routes>
  );
}

export default App;
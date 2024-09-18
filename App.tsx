import { Text, View } from "react-native";
import "./global.css";
import { Router } from "./app/routes";
import { AuthProvider } from "./app/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
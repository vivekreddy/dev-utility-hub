import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFoundPage from "@/pages/NotFoundPage";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import JsonFormatter from "./pages/tools/JsonFormatter";
import Base64Tool from "./pages/tools/Base64Tool";
import UrlEncoder from "./pages/tools/UrlEncoder";
import CodeFormatter from "./pages/tools/CodeFormatter";
import ColorPicker from "./pages/tools/ColorPicker";
import MarkdownPreview from "./pages/tools/MarkdownPreview";
import CsvToJson from "./pages/tools/CsvToJson";
import UuidGenerator from "./pages/tools/UuidGenerator";
import LoremIpsum from "./pages/tools/LoremIpsum";
import HashGenerator from "./pages/tools/HashGenerator";

function Router() {
  return (
    <RootLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/tools/json-formatter" component={JsonFormatter} />
        <Route path="/tools/base64" component={Base64Tool} />
        <Route path="/tools/url-encoder" component={UrlEncoder} />
        <Route path="/tools/code-formatter" component={CodeFormatter} />
        <Route path="/tools/color-picker" component={ColorPicker} />
        <Route path="/tools/markdown-preview" component={MarkdownPreview} />
        <Route path="/tools/csv-to-json" component={CsvToJson} />
        <Route path="/tools/uuid-generator" component={UuidGenerator} />
        <Route path="/tools/lorem-ipsum" component={LoremIpsum} />
        <Route path="/tools/hash-generator" component={HashGenerator} />
        <Route component={NotFoundPage} />
      </Switch>
    </RootLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

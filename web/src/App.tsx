import "./lib/dayjs";
import "./styles/global.css";
import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";
function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-4/5 max-w-5x1 px-6 flex flex-col gap-16">
        <Header />
        <SummaryTable />
      </div>
    </div>
  );
}

export default App;

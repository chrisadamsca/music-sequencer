import './App.scss';
import Home from './pages/Home/Home';

const App = () => {

  // const [clock, setClock] = useState<Clock>();
  
  // useEffect(() => {
  //   if (clock) {
  //     clock.start();
  //   }
  // }, [clock])

  

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;

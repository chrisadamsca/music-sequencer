import ArrangementView from "../../components/ArrangementView/ArrangementView";
import Panel from "../../components/Panel/Panel";
import Transport from "../../components/Transport/Transport";
import './Home.scss'

const Home = () => {

  return (
    <section id="Home">
      <ArrangementView />
      <Panel />
      <Transport />
    </section>
  );

}

export default Home;

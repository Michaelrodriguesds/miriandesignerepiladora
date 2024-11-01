import React from 'react';
import Offers from './components/Offers';
import Procedures from './components/Procedures';
import Messages from './components/Messages';
import Footer from './components/Footer';
import Header from './components/Header';
import About from './components/About';
import Gallery from './components/Gallery';
import Certificacao from './components/Certificacao';

function App() {
  return (
    <div className="App">
      <Header />
      <About />
      <Certificacao />
      <Gallery />
      <Offers />
      <Procedures />
      <Messages />
      <Footer />
    </div>
  );
}

export default App;

import React from 'react';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to QuestScribe</h1>
      <p className="intro">Embark on a journey through stories and adventures crafted by the minds of dedicated storytellers and TTRPG enthusiasts.</p>
      
      <section className="about">
        <h2>About QuestScribe</h2>
        <p className="description">
          Dive into a world where imagination knows no bounds! QuestScribe offers a unique platform tailored for documenting, sharing, and exploring the adventures that bring fantasy worlds to life.
        </p>
        <p className="features">
          Uncover a vast collection of journals, immerse yourself in intricate tales of heroism, and let your creativity shine as you document your own adventures. QuestScribe is here to provide you with the tools you need to make your stories unforgettable.
        </p>
        <p className="cta">
          Ready to join the adventure? Start your journey with QuestScribe and let your tales become part of a growing legacy!
        </p>
      </section>
    </div>
  );
};

export default Home;
